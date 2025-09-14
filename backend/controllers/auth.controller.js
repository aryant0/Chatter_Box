import User from '../models/user.model.js';
import bcryptjs from "bcryptjs"
import generateTokenAndSetCookie from '../utils/generatetoken.js';
export const signup = async (req, res) => {
    try {
        const { fullName, username, gender, password, confirmpassword } = req.body;

        if (password !== confirmpassword) {
            return res.status(400).json({ error: "Passwords don't match" });
        }

        const user = await User.findOne({ username });

        if (user) {
            return res.status(400).json({ error: "Username already exists" });
        }

        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(password,salt)

        // HASHED PASSWORD HERE - REPLACE THIS LINE WITH YOUR HASHING LOGIC
        // Example: const hashedPassword = await bcrypt.hash(password, 10);
        // Temporary placeholder

        const boyProfilePic = `https://avatar.iran.liara.run/public/boy?username=${username}`;
        const girlProfilePic = `https://avatar.iran.liara.run/public/girl?username=${username}`;

        const newUser = new User({
            fullName,
            username,
            password: hashedPassword,
            gender,
            profilePic: gender === "male" ? boyProfilePic : girlProfilePic
        });

        

        if(newUser){
            // generate JWT token

            generateTokenAndSetCookie(newUser._id,res);
            await newUser.save();

            res.status(201).json({
                _id: newUser._id,
                fullName: newUser.fullName,
                username: newUser.username
            });
        }else{
            res.status(400).json({error:"invalid user data"})
        }

        
    } catch (error) {
        console.error("Error in signup controller:", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const login = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        const isPasswordCorrect = await bcryptjs.compare(password, user?.password || "");

        // Corrected logical check:
        // The condition should be true if the user doesn't exist OR if the password is NOT correct.
        if (!user || !isPasswordCorrect) {
            return res.status(400).json({ error: "Invalid credentials" });
        }

        generateTokenAndSetCookie(user._id, res);

        res.status(200).json({
            _id: user._id,
            fullName: user.fullName,
            username: user.username,
            profilePic: user.profilePic
        });
    } catch (error) {
        console.log("Error in login controller", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};
export const logout = async(req, res) => {
    try{
        res.cookie("jwt","",{maxAge:0});
        res.status(200).json({message:"logged out successfully"})

    }catch (error){
        console.log("Error in logoutcontroller", error.message);
        res.status(500).json({ error: "Internal server error" });

    }
    
};
