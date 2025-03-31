const express = require('express');
const Order = require('../orders/order.model');
const Book = require('../books/book.model');
const Visit = require('./visit.model');
const router = express.Router();


// Function to calculate admin stats
router.get("/", async (req, res) => {
    try {
        // 1. Total number of orders
        const totalOrders = await Order.countDocuments();

        // 2. Total sales (sum of all totalPrice from orders)
        const totalSales = await Order.aggregate([
            {
                $group: {
                    _id: null,
                    totalSales: { $sum: "$totalPrice" },
                }
            }
        ]);

        // 4. Trending books statistics: 
        const trendingBooksCount = await Book.aggregate([
            { $match: { trending: true } },  // Match only trending books
            { $count: "trendingBooksCount" }  // Return the count of trending books
        ]);
        
        // If you want just the count as a number, you can extract it like this:
        const trendingBooks = trendingBooksCount.length > 0 ? trendingBooksCount[0].trendingBooksCount : 0;

        // 5. Total number of books
        const totalBooks = await Book.countDocuments();

        // 6. Monthly sales (group by month and sum total sales for each month)
        const monthlySales = await Order.aggregate([
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
                    totalSales: { $sum: "$totalPrice" },
                    totalOrders: { $sum: 1 },
                    averageOrderValue: { $avg: "$totalPrice" }
                }
            },
            {
                $project: {
                    _id: 1,
                    totalSales: { $round: ["$totalSales", 2] },
                    totalOrders: 1,
                    averageOrderValue: { $round: ["$averageOrderValue", 2] }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
        const dailyVisits = await Visit.countDocuments({
            createdAt: { $gte: oneDayAgo }
        });

        const usersByAvgOrder = await Order.aggregate([
            {
                $group: {
                    _id: "$email",
                    name: { $first: "$name" },
                    totalOrders: { $sum: 1 },
                    totalSpent: { $sum: "$totalPrice" },
                    averageOrder: { $avg: "$totalPrice" }
                }
            },
            {
                $project: {
                    _id: 1,
                    name: 1,
                    totalOrders: 1,
                    averageOrder: { $round: ["$averageOrder", 2] }
                }
            },
            { $sort: { averageOrder: -1 } },
            { $limit: 10 }
        ]);
        

        // Result summary
        res.status(200).json({  
            totalOrders,
            totalSales: totalSales[0]?.totalSales || 0,
            trendingBooks,
            totalBooks,
            monthlySales,
            dailyVisits,
            usersByAvgOrder
        });
      
    } catch (error) {
        console.error("Error fetching admin stats:", error);
        res.status(500).json({ message: "Failed to fetch admin stats" });
    }
});

router.post("/record-visit", async (req, res) => {
    try {
        const visit = new Visit({
            timestamp: new Date(),
            userAgent: req.headers['user-agent']
        });
        await visit.save();
        res.status(201).json({ message: "Visit recorded" });
    } catch (error) {
        console.error("Error recording visit:", error);
        res.status(500).json({ message: "Failed to record visit" });
    }
});

module.exports = router;