const Transaction = require('../models/Transaction');

// create transaction
const createTransaction = async (req, res) => {
    try {
        const {amount, type, category, date, description} = req.body;

        if(!amount || !type || !category){
            return res.status(400).json({
                success: false,
                message: "Please provide all the required fields"
            });
        }

        // amount validation
        if(amount <= 0){
            return res.status(400).json({
                success: false,
                message: "Amount must be greater than 0"
            });
        }

        // transaction type validation
        const transactionType = ['income', 'expense'];
        const lowercaseType = type.toLowerCase();

        if(!transactionType.includes(lowercaseType)){
            return res.status(400).json({
                success: false,
                message: "Type must be income or expense"
            });
        }

        const transaction = await Transaction.create({
            amount, 
            type: lowercaseType,
            category: category.trim(),
            date: date || Date.now(),
            description,
            createdBy: req.user.id
        });

        res.status(201).json({
            success: true,
            message: "Transaction created successfully",
            transactionData: transaction
        });

    } catch (error) {
        console.log("Error in createTransaction -> ", error);
        res.status(500).json({
            success: false,
            message: "Something went wrong"
        });
    }
}

// getAllTransaction
const getAllTransaction = async (req, res) => {
    try {
        const { type, category, startDate, endDate } = req.query;

        const filter = {};

        // filter by type
        if (type) {
            const validTypes = ['income', 'expense'];
            if (!validTypes.includes(type.toLowerCase())) {
                return res.status(400).json({
                    success: false,
                    message: "Type must be income or expense"
                });
            }
            filter.type = type.toLowerCase();
        }

        // filter by category
        if (category) {
            filter.category = category.trim();
        }

        // filter by date
        if (startDate || endDate) {
            filter.date = {};
            if (startDate) filter.date.$gte = new Date(startDate); 
            if (endDate) filter.date.$lte = new Date(endDate);    
        }

        const transactions = await Transaction.find(filter)
            .populate('createdBy', 'name email role')
            .sort({ date: -1 }); 

        res.status(200).json({
            success: true,
            count: transactions.length,
            data: transactions
        });

    } catch (error) {
        console.log("Error in getAllTransactions -> ", error);
        res.status(500).json({
            success: false,
            message: "Something went wrong"
        });
    }
};

// get transaction By id
const getTransactionById = async (req, res) => {
    try {
        const transaction = await Transaction.findById(req.params.id)
            .populate('createdBy', 'name email role');

        if (!transaction) {
            return res.status(404).json({
                success: false,
                message: "Transaction not found"
            });
        }

        res.status(200).json({
            success: true,
            data: transaction
        });

    } catch (error) {
        console.log("Error in getTransactionById -> ", error);
        res.status(500).json({
            success: false,
            message: "Something went wrong"
        });
    }
};

// update transaction
const updateTransaction = async(req, res) => {
    try {
        const { amount, type, category, date, description } = req.body;

        if (!amount && !type && !category && !date && !description) {
            return res.status(400).json({
                success: false,
                message: "Please provide at least one field to update"
            });
        }

        if (amount && amount <= 0) {
            return res.status(400).json({
                success: false,
                message: "Amount must be greater than 0"
            });
        }

        if (type) {
            const validTypes = ['income', 'expense'];
            if (!validTypes.includes(type)) {
                return res.status(400).json({
                    success: false,
                    message: "Type must be income or expense"
                });
            }
        }

        const transaction = await Transaction.findById(req.params.id);
        if (!transaction) {
            return res.status(404).json({
                success: false,
                message: "Transaction not found"
            });
        }

        const updatedTransaction = await Transaction.findByIdAndUpdate(
            req.params.id,
            { amount, type, category, date, description },
            { new: true, runValidators: true }
        );

        res.status(200).json({
            success: true,
            message: "Transaction updated successfully",
            data: updatedTransaction
        });
    } catch (error) {
        console.log("Error in updateTransaction -> ", error);
        res.status(500).json({
            success: false,
            message: "Something went wrong"
        });
    }
}

// delete transaction
const deleteTransaction = async (req, res) => {
    try {
        const transaction = await Transaction.findById(req.params.id);

        if (!transaction) {
            return res.status(404).json({
                success: false,
                message: "Transaction not found"
            });
        }

        await Transaction.findByIdAndDelete(req.params.id);

        res.status(200).json({
            success: true,
            message: "Transaction deleted successfully"
        });
    } catch (error) {
        console.log("Error in deleteTransaction -> ", error);
        res.status(500).json({
            success: false,
            message: "Something went wrong"
        });
    }
};

module.exports = {createTransaction, updateTransaction, deleteTransaction, getAllTransaction, getTransactionById}