using SpiceAPI.Models;

namespace SpiceAPI.Utility
{
    public static class SD
    {
        public const string AdminUser = "admin";
        public const string CustomerUser = "customer";
        public const string KitchenUser = "kitchen";
        public const string FrontDeskUser = "frontDesk";
        public const string ManagerUser = "manager";

        public const string StatusSubmitted = "Submitted";
        public const string StatusInProcess = "Being Prepared";
        public const string StatusReady = "Ready For Pickup";
        public const string StatusCompleted = "Completed";
        public const string StatusCancelled = "Cancelled";

        public const string PaymentStatusPending = "Pending";
        public const string PaymentStatusApproved = "Approved";
        public const string PaymentStatusRejected = "Rejected";

        public static double DiscountedPrice(Coupon coupon, double originalOrderTotal)
        {
            if (coupon == null)
            {
                return originalOrderTotal;
            }
            else
            {
                if (coupon.MinimumAmount > originalOrderTotal)
                {
                    return originalOrderTotal;
                }
                else
                {
                    if (coupon.CouponType == Coupon.ECouponType.Dollar)
                    {
                        return Math.Round(originalOrderTotal - coupon.Discount, 2);
                    }
                    if (coupon.CouponType == Coupon.ECouponType.Percent)
                    {
                        return Math.Round(originalOrderTotal - (originalOrderTotal * coupon.Discount / 100), 2);
                    }
                }
                return originalOrderTotal;
            }
        }
    }
}
