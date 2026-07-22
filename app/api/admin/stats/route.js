import { query } from '../../../../lib/db';
import { getUserSession } from '../../../../lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    // 1. Auth check
    const userId = getUserSession(request);
    if (!userId) {
      return Response.json({ error: "Non authentifié" }, { status: 401 });
    }

    const adminCheck = await query('SELECT is_admin FROM users WHERE id = $1', [userId]);
    if (adminCheck.rows.length === 0 || !adminCheck.rows[0].is_admin) {
      return Response.json({ error: "Accès refusé" }, { status: 403 });
    }

    // Parse period parameter
    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || 'all';

    // Build date filter SQL chunks
    let dateFilterPayments = "";
    let dateFilterOrders = "";
    let dateFilterUsers = "";

    if (period === '7d') {
      dateFilterPayments = "AND created_at >= CURRENT_DATE - INTERVAL '7 days'";
      dateFilterOrders = "WHERE date_ordered >= CURRENT_DATE - INTERVAL '7 days'";
      dateFilterUsers = "WHERE created_at >= CURRENT_DATE - INTERVAL '7 days'";
    } else if (period === '30d') {
      dateFilterPayments = "AND created_at >= CURRENT_DATE - INTERVAL '30 days'";
      dateFilterOrders = "WHERE date_ordered >= CURRENT_DATE - INTERVAL '30 days'";
      dateFilterUsers = "WHERE created_at >= CURRENT_DATE - INTERVAL '30 days'";
    } else if (period === 'this_month') {
      dateFilterPayments = "AND created_at >= DATE_TRUNC('month', CURRENT_DATE)";
      dateFilterOrders = "WHERE date_ordered >= DATE_TRUNC('month', CURRENT_DATE)";
      dateFilterUsers = "WHERE created_at >= DATE_TRUNC('month', CURRENT_DATE)";
    } else if (period === 'this_year') {
      dateFilterPayments = "AND created_at >= DATE_TRUNC('year', CURRENT_DATE)";
      dateFilterOrders = "WHERE date_ordered >= DATE_TRUNC('year', CURRENT_DATE)";
      dateFilterUsers = "WHERE created_at >= DATE_TRUNC('year', CURRENT_DATE)";
    }

    // 2. Fetch stats
    const totalUsersRes = await query('SELECT COUNT(*)::int as count FROM users');
    const activeUsersRes = await query("SELECT COUNT(*)::int as count FROM users WHERE status = 'active'");
    
    // Period-filtered stats
    const totalOrdersRes = await query(`SELECT COUNT(*)::int as count FROM orders ${dateFilterOrders}`);
    const newUsersRes = await query(`SELECT COUNT(*)::int as count FROM users ${dateFilterUsers}`);
    
    const subRevRes = await query(`
      SELECT COALESCE(SUM(amount), 0)::float as sum 
      FROM unitechpay_payments 
      WHERE order_id IS NULL AND status = 'completed' ${dateFilterPayments}
    `);
    const orderVolRes = await query(`
      SELECT COALESCE(SUM(amount), 0)::float as sum 
      FROM unitechpay_payments 
      WHERE order_id IS NOT NULL AND status = 'completed' ${dateFilterPayments}
    `);
    
    const activeDisputesRes = await query("SELECT COUNT(*)::int as count FROM disputes WHERE status IN ('pending', 'in_progress')");
    const commRateRes = await query("SELECT value FROM platform_settings WHERE key = 'commission_rate'");

    const commissionRate = commRateRes.rows.length > 0 ? parseFloat(commRateRes.rows[0].value) : 5.0;
    
    // Project commission revenue
    const transactionVolume = orderVolRes.rows[0].sum;
    const projectedCommission = (transactionVolume * commissionRate) / 100;

    return Response.json({
      success: true,
      stats: {
        totalUsers: totalUsersRes.rows[0].count,
        activeUsers: activeUsersRes.rows[0].count,
        newUsers: newUsersRes.rows[0].count,
        totalOrders: totalOrdersRes.rows[0].count,
        subscriptionRevenue: subRevRes.rows[0].sum,
        transactionVolume: transactionVolume,
        commissionRate: commissionRate,
        projectedCommission: projectedCommission,
        activeDisputes: activeDisputesRes.rows[0].count
      }
    });
  } catch (error) {
    console.error("GET admin stats error:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
