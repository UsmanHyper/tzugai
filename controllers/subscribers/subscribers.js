
const { validateUserData } = require('../../middleware/validateUsers.js')
const { send_Email } = require("../../middleware/sendEmailScray.js");
const Subscriber = require("../../models/scary_subscribers.js");

del_all = async (req, res) => {
    try {
        // Delete all subscribers
        const result = await Subscriber.deleteMany({});

        // Check if any subscribers were deleted
        if (result.deletedCount > 0) {
            res.status(200).json({ message: "All subscribers deleted successfully" });
        } else {
            res.status(404).json({ message: "No subscribers found" });
        }
    } catch (error) {
        console.error("Error deleting subscribers:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

del_one = async (req, res) => {
    try {
        const userId = req.params.userId;

        await Subscriber.deleteOne({ _id: userId });

        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
get_one = async (req, res) => {
    try {
        const userId = req.params.id;
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const search = req.query.search || "";

        const order = req.query.orderby || "asc";
        const sort = req.query.sortby || "email";

        let orderby = {};
        if (order.toLowerCase() === "asc") {
            orderby[sort] = 1; // 1 for ascending order, -1 for descending order
        } else {
            orderby[sort] = -1; // Assuming ascending order by default, modify as needed
        }

        const total = await Subscriber.countDocuments({ _id: userId }); // Count all users
        const users = await Subscriber.find({
            _id: userId,
            $or: [
                // { first_name: { $regex: search, $options: "i" } },
                { email: { $regex: search, $options: "i" } },
                // Add more fields as needed
            ]
        }).skip(skip).limit(limit).sort(orderby);

        let nextPage = false;
        if (users.length >= limit && total > skip + limit) {
            nextPage = true;
        }

        res.status(200).json({
            status: "Success",
            data: { users },
            message: "Users fetched successfully",
            currentPage: page,
            totalDatainData: users.length,
            totalData: total,
            nextPage: nextPage,
            prevPage: page !== 1,
        });
    } catch (error) {
        console.error("Error fetching all user data:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}
get_all = async (req, res) => {
    try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const search = req.query.search || "";

        const order = req.query.orderby || "asc";
        const sort = req.query.sortby || "email";

        let orderby = {};
        if (order.toLowerCase() === "asc") {
            orderby[sort] = 1; // 1 for ascending order, -1 for descending order
        } else {
            orderby[sort] = -1; // Assuming ascending order by default, modify as needed
        }

        const total = await Subscriber.countDocuments(); // Count all users
        const users = await Subscriber.find({
            $or: [
                // { first_name: { $regex: search, $options: "i" } },
                { email: { $regex: search, $options: "i" } },
                // Add more fields as needed
            ]
        }).skip(skip).limit(limit).sort(orderby);

        let nextPage = false;
        if (users.length >= limit && total > skip + limit) {
            nextPage = true;
        }

        res.status(200).json({
            status: "Success",
            data: { users },
            message: "Users fetched successfully",
            currentPage: page,
            totalDatainData: users.length,
            totalData: total,
            nextPage: nextPage,
            prevPage: page !== 1,
        });
    } catch (error) {
        console.error("Error fetching all user data:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

test = async (req, res) => {
    res.status(500).send('Node Working')
}
add = async (req, res) => {
    try {
        const response = req.body;
        // Check if the email is already in use
        const existingUser = await Subscriber.findOne({ email: response.email });
        if (existingUser) {
            return res.status(400).json({ status: 400, error: 'This Email Is Already Registered' });
        }
        // Continue with saving the user
        await saveUser(response, res, req.file ? req.file.path : null);
    } catch (error) {
        console.error('Validation or Signup Error:', error);
        // Pass error to the next middleware
        next(error);
    }

}


const saveUser = async (req, res, image) => {
    try {

        const newUser = new Subscriber({
            email: req.email,

        });

        const username = req.email ? req.email : "";
        const savedUser = await newUser.save();
        await send_Email(req.email, 'Subscribe', { username: req?.email });
        return res.status(200).json({
            status: 200,
            data: {
                newUser
            },
            message: 'Subscriber has been created',
        });


    } catch (error) {
        console.error('Save Subscriber Error:', error);
        res.status(500).json({ status: 500, error: 'Internal Server Error during Subscriber creation' });
    }
};


module.exports = {
    del_all,
    del_one,
    get_one,
    get_all,
    test,
    add
}