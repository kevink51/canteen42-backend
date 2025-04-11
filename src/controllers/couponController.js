// Coupon Controller
const { Coupon } = require('../models/schemas');
const admin = require('../config/firebase-config');

class CouponController {
  // Get all coupons (admin only)
  async getAllCoupons(req, res) {
    try {
      const coupons = await Coupon.getAll();
      res.status(200).json({ success: true, coupons });
    } catch (error) {
      console.error('Error getting all coupons:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  }

  // Get active coupons (public)
  async getActiveCoupons(req, res) {
    try {
      const allCoupons = await Coupon.getAll();
      const now = new Date();
      
      // Filter active coupons
      const activeCoupons = allCoupons.filter(coupon => {
        return coupon.isActive && 
               (!coupon.startDate || new Date(coupon.startDate) <= now) &&
               (!coupon.endDate || new Date(coupon.endDate) >= now) &&
               (!coupon.usageLimit || coupon.usageCount < coupon.usageLimit);
      });
      
      res.status(200).json({ success: true, coupons: activeCoupons });
    } catch (error) {
      console.error('Error getting active coupons:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  }

  // Get coupon by ID
  async getCouponById(req, res) {
    try {
      const coupon = await Coupon.getById(req.params.id);
      res.status(200).json({ success: true, coupon });
    } catch (error) {
      console.error('Error getting coupon by ID:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  }

  // Create new coupon (admin only)
  async createCoupon(req, res) {
    try {
      const couponData = {
        ...req.body,
        usageCount: 0,
        createdAt: admin.firestore.FieldValue.serverTimestamp()
      };
      
      const coupon = await Coupon.create(couponData);
      res.status(201).json({ success: true, coupon });
    } catch (error) {
      console.error('Error creating coupon:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  }

  // Update coupon (admin only)
  async updateCoupon(req, res) {
    try {
      const coupon = await Coupon.update(req.params.id, req.body);
      res.status(200).json({ success: true, coupon });
    } catch (error) {
      console.error('Error updating coupon:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  }

  // Delete coupon (admin only)
  async deleteCoupon(req, res) {
    try {
      const result = await Coupon.delete(req.params.id);
      res.status(200).json({ success: true, result });
    } catch (error) {
      console.error('Error deleting coupon:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  }

  // Validate coupon
  async validateCoupon(req, res) {
    try {
      const { code } = req.params;
      const { cartItems, subtotal } = req.body;
      
      // Find coupon by code
      const coupons = await Coupon.query('code', '==', code);
      
      if (coupons.length === 0) {
        return res.status(404).json({ 
          success: false, 
          error: 'Coupon not found' 
        });
      }
      
      const coupon = coupons[0];
      const now = new Date();
      
      // Check if coupon is active
      if (!coupon.isActive) {
        return res.status(400).json({ 
          success: false, 
          error: 'Coupon is not active' 
        });
      }
      
      // Check if coupon has started
      if (coupon.startDate && new Date(coupon.startDate) > now) {
        return res.status(400).json({ 
          success: false, 
          error: 'Coupon is not yet valid' 
        });
      }
      
      // Check if coupon has expired
      if (coupon.endDate && new Date(coupon.endDate) < now) {
        return res.status(400).json({ 
          success: false, 
          error: 'Coupon has expired' 
        });
      }
      
      // Check if coupon has reached usage limit
      if (coupon.usageLimit && coupon.usageCount >= coupon.usageLimit) {
        return res.status(400).json({ 
          success: false, 
          error: 'Coupon usage limit reached' 
        });
      }
      
      // Check minimum purchase requirement
      if (coupon.minPurchase && subtotal < coupon.minPurchase) {
        return res.status(400).json({ 
          success: false, 
          error: `Minimum purchase of $${coupon.minPurchase} required` 
        });
      }
      
      // Calculate discount
      let discount = 0;
      
      if (coupon.type === 'percentage') {
        discount = subtotal * (coupon.value / 100);
      } else if (coupon.type === 'fixed') {
        discount = coupon.value;
      }
      
      // Apply maximum discount if specified
      if (coupon.maxDiscount && discount > coupon.maxDiscount) {
        discount = coupon.maxDiscount;
      }
      
      res.status(200).json({ 
        success: true, 
        coupon,
        discount,
        total: subtotal - discount
      });
    } catch (error) {
      console.error('Error validating coupon:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  }

  // Apply coupon to order
  async applyCoupon(req, res) {
    try {
      const { code } = req.params;
      const { orderId } = req.body;
      
      // Find coupon by code
      const coupons = await Coupon.query('code', '==', code);
      
      if (coupons.length === 0) {
        return res.status(404).json({ 
          success: false, 
          error: 'Coupon not found' 
        });
      }
      
      const coupon = coupons[0];
      
      // Increment usage count
      await Coupon.update(coupon.id, {
        usageCount: (coupon.usageCount || 0) + 1
      });
      
      res.status(200).json({ 
        success: true, 
        message: 'Coupon applied successfully' 
      });
    } catch (error) {
      console.error('Error applying coupon:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  }
}

module.exports = new CouponController();
