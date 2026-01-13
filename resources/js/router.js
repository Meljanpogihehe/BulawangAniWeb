import { createRouter, createWebHistory } from 'vue-router';
import Home from './Pages/Home.vue';
import Products from './Pages/Products.vue';
import ProductDetail from './Pages/ProductDetail.vue';
import Cart from './Pages/Cart.vue';
import Checkout from './Pages/Checkout.vue';
import Orders from './Pages/Orders.vue';
import Profile from './Pages/Profile.vue';
import About from './Pages/About.vue';
import Contact from './Pages/Contact.vue';
import Design from './Pages/Design.vue';
import Login from './Pages/Auth/Login.vue';
import Register from './Pages/Auth/Register.vue';
import AdminIndex from './Pages/Admin/index.vue';
import SellerIndex from './Pages/Seller/index.vue';

// Seller Components
import SellerDashboard from './Pages/Seller/Dashboard.vue';
import SalesSummary from './Pages/Seller/SalesSummary.vue';
import OrderOverview from './Pages/Seller/OrderOverview.vue';
import AddProduct from './Pages/Seller/AddProduct.vue';
import ProductList from './Pages/Seller/ProductList.vue';
import StockManagement from './Pages/Seller/StockManagement.vue';
import NewOrders from './Pages/Seller/NewOrders.vue';
import ProcessingOrders from './Pages/Seller/ProcessingOrders.vue';
import CompletedOrders from './Pages/Seller/CompletedOrders.vue';
import CancelledOrders from './Pages/Seller/CancelledOrders.vue';
import ShippingSetup from './Pages/Seller/ShippingSetup.vue';
import Earnings from './Pages/Seller/Earnings.vue';
import Vouchers from './Pages/Seller/Vouchers.vue';
import CustomerMessages from './Pages/Seller/CustomerMessages.vue';
import Reviews from './Pages/Seller/Reviews.vue';
import StoreProfile from './Pages/Seller/StoreProfile.vue';
import StorePolicies from './Pages/Seller/StorePolicies.vue';
import SalesReports from './Pages/Seller/SalesReports.vue';
import InventoryReports from './Pages/Seller/InventoryReports.vue';
import ProfileSettings from './Pages/Seller/ProfileSettings.vue';
import ChangePassword from './Pages/Seller/ChangePassword.vue';
import PayoutHistory from './Pages/Seller/PayoutHistory.vue';
import Discounts from './Pages/Seller/Discounts.vue';

// Admin Components
import Dashboard from './Pages/Admin/Dashboard.vue';
import AdminAccounts from './Pages/Admin/AdminAccounts.vue';
import SellerAccounts from './Pages/Admin/SellerAccounts.vue';
import CustomerAccounts from './Pages/Admin/CustomerAccounts.vue';
import ProductsAdmin from './Pages/Admin/Products.vue';
import Categories from './Pages/Admin/Categories.vue';
import ProductApproval from './Pages/Admin/ProductApproval.vue';
import OrdersAdmin from './Pages/Admin/Orders.vue';
import OrderTracking from './Pages/Admin/OrderTracking.vue';
import Returns from './Pages/Admin/Returns.vue';
import SellerVerification from './Pages/Admin/SellerVerification.vue';
import SellerPerformance from './Pages/Admin/SellerPerformance.vue';
import ActivityLogs from './Pages/Admin/ActivityLogs.vue';
import Announcements from './Pages/Admin/Announcements.vue';
import Banners from './Pages/Admin/Banners.vue';
import Commissions from './Pages/Admin/Commissions.vue';
import Payments from './Pages/Admin/Payments.vue';
import Payouts from './Pages/Admin/Payouts.vue';
import PlatformSettings from './Pages/Admin/PlatformSettings.vue';
import ProductPerformance from './Pages/Admin/ProductPerformance.vue';
import Reports from './Pages/Admin/Reports.vue';
import AdminSalesReports from './Pages/Admin/SalesReports.vue';
import Security from './Pages/Admin/Security.vue';
import ShippingTax from './Pages/Admin/ShippingTax.vue';
import SystemLogs from './Pages/Admin/SystemLogs.vue';
import UserActivity from './Pages/Admin/UserActivity.vue';

const routes = [
    { path: '/', name: 'home', component: Home },
    { path: '/products', name: 'products', component: Products },
    { path: '/product/:id', name: 'product-detail', component: ProductDetail, props: true },
    { path: '/cart', name: 'cart', component: Cart },
    { path: '/checkout', name: 'checkout', component: Checkout },
    { path: '/orders', name: 'orders', component: Orders },
    { path: '/profile', name: 'profile', component: Profile },
    { path: '/about', name: 'about', component: About },
    { path: '/contact', name: 'contact', component: Contact },
    { path: '/design', name: 'design', component: Design },
    { path: '/login', name: 'login', component: Login },
    { path: '/register', name: 'register', component: Register },
    
    // Admin Routes
    {
        path: '/admin',
        component: AdminIndex,
        children: [
            { path: '', name: 'admin-dashboard', component: Dashboard },
            { path: 'dashboard', name: 'admin-dashboard', component: Dashboard },
            { path: 'admin-accounts', name: 'admin-accounts', component: AdminAccounts },
            { path: 'seller-accounts', name: 'seller-accounts', component: SellerAccounts },
            { path: 'buyer-accounts', name: 'customer-accounts', component: CustomerAccounts },
            { path: 'products', name: 'admin-products', component: ProductsAdmin },
            { path: 'categories', name: 'admin-categories', component: Categories },
            { path: 'product-approval', name: 'product-approval', component: ProductApproval },
            { path: 'orders', name: 'admin-orders', component: OrdersAdmin },
            { path: 'order-tracking', name: 'order-tracking', component: OrderTracking },
            { path: 'returns', name: 'admin-returns', component: Returns },
            { path: 'seller-verification', name: 'seller-verification', component: SellerVerification },
            { path: 'seller-performance', name: 'seller-performance', component: SellerPerformance },
            { path: 'activity-logs', name: 'activity-logs', component: ActivityLogs },
            { path: 'announcements', name: 'announcements', component: Announcements },
            { path: 'banners', name: 'banners', component: Banners },
            { path: 'commissions', name: 'commissions', component: Commissions },
            { path: 'payments', name: 'payments', component: Payments },
            { path: 'payouts', name: 'payouts', component: Payouts },
            { path: 'platform-settings', name: 'platform-settings', component: PlatformSettings },
            { path: 'product-performance', name: 'product-performance', component: ProductPerformance },
            { path: 'reports', name: 'reports', component: Reports },
            { path: 'sales-reports', name: 'sales-reports', component: AdminSalesReports },
            { path: 'security', name: 'security', component: Security },
            { path: 'shipping-tax', name: 'shipping-tax', component: ShippingTax },
            { path: 'system-logs', name: 'system-logs', component: SystemLogs },
            { path: 'user-activity', name: 'user-activity', component: UserActivity }
        ]
    },

    // Seller Routes
    {
        path: '/seller',
        component: SellerIndex,
        children: [
            { path: '', name: 'seller-dashboard', component: SellerDashboard },
            { path: 'dashboard', name: 'seller-dashboard', component: SellerDashboard },
            { path: 'sales-summary', name: 'sales-summary', component: SalesSummary },
            { path: 'order-overview', name: 'order-overview', component: OrderOverview },
            { path: 'products', name: 'seller-products', component: ProductList },
            { path: 'add-product', name: 'add-product', component: AddProduct },
            { path: 'stock-management', name: 'stock-management', component: StockManagement },
            { path: 'orders/new', name: 'new-orders', component: NewOrders },
            { path: 'orders/processing', name: 'processing-orders', component: ProcessingOrders },
            { path: 'orders/completed', name: 'completed-orders', component: CompletedOrders },
            { path: 'orders/cancelled', name: 'cancelled-orders', component: CancelledOrders },
            { path: 'shipping-setup', name: 'shipping-setup', component: ShippingSetup },
            { path: 'order-fulfillment', name: 'order-fulfillment', component: ShippingSetup },
            { path: 'earnings', name: 'earnings', component: Earnings },
            { path: 'payout-history', name: 'payout-history', component: PayoutHistory },
            { path: 'discounts', name: 'discounts', component: Discounts },
            { path: 'vouchers', name: 'vouchers', component: Vouchers },
            { path: 'customer-messages', name: 'customer-messages', component: CustomerMessages },
            { path: 'reviews-ratings', name: 'reviews-ratings', component: Reviews },
            { path: 'store-profile', name: 'store-profile', component: StoreProfile },
            { path: 'store-policies', name: 'store-policies', component: StorePolicies },
            { path: 'sales-reports', name: 'seller-sales-reports', component: SalesReports },
            { path: 'inventory-reports', name: 'inventory-reports', component: InventoryReports },
            { path: 'profile-settings', name: 'profile-settings', component: ProfileSettings },
            { path: 'change-password', name: 'change-password', component: ChangePassword }
        ]
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

export default router;
