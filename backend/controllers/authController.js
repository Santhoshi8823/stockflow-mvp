const { PrismaClient } =
  require("@prisma/client");

const bcrypt =
  require("bcryptjs");

const jwt =
  require("jsonwebtoken");

const prisma =
  new PrismaClient();

const signup = async (
  req,
  res
) => {

  try {

    const {
      organizationName,
      email,
      password,
    } = req.body;

    const existingUser =
      await prisma.users.findFirst({
        where: {
          email,
        },
      });

    if (existingUser) {

      return res.status(400).json({
        success: false,
        message:
          "Email already exists",
      });
    }

    const hashedPassword =
      await bcrypt.hash(
        password,
        10
      );

    const organization =
      await prisma.organizations.create({
        data: {
          name:
            organizationName,
          created_at:
            new Date(),
          updated_at:
            new Date(),
        },
      });

    await prisma.users.create({
      data: {
        email,
        password:
          hashedPassword,
        orgId:
          organization.id,
        added_date:
          new Date(),
      },
    });

    res.status(201).json({
      success: true,
      message:
        "Signup successful",
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message:
        "Internal server error",
    });
  }
};


// LOGIN API
const login = async (
  req,
  res
) => {

  try {

    const {
      email,
      password,
    } = req.body;

    // Find user
    const user =
      await prisma.users.findFirst({
        where: {
          email,
        },
      });

    if (!user) {

      return res.status(400).json({
        success: false,
        message:
          "User not found",
      });
    }

    // Compare password
    const isMatch =
      await bcrypt.compare(
        password,
        user.password
      );

    if (!isMatch) {

      return res.status(400).json({
        success: false,
        message:
          "Invalid password",
      });
    }

    // Create JWT token
    const token =
      jwt.sign(
        {
          id:
            user.id.toString(),
          email:
            user.email,
          orgId:
            user.orgId.toString(),
        },
        process.env.JWT_SECRET,
        {
          expiresIn: "7d",
        }
      );

    res.status(200).json({
      success: true,
      message:
        "Login successful",
      token,
      user: {
        id:
          user.id.toString(),
        email:
          user.email,
        orgId:
          user.orgId.toString(),
      },
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message:
        "Internal server error",
    });
  }
};

module.exports = {
  signup,
  login,
};