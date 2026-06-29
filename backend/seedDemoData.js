import dotenv from "dotenv";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import User from "./models/User.js";
import Book from "./models/Book.js";
import BookCategory from "./models/BookCategory.js";
import BookTransaction from "./models/BookTransaction.js";

dotenv.config();

const DEFAULT_PASSWORD = "TestPass@123";

const databaseOptions = {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

async function seedDemoData() {
  await mongoose.connect(process.env.MONGO_URL, databaseOptions);

  await Promise.all([
    User.deleteMany({}),
    Book.deleteMany({}),
    BookCategory.deleteMany({}),
    BookTransaction.deleteMany({}),
  ]);

  const categories = await BookCategory.insertMany([
    { categoryName: "Autobiography", books: [] },
    { categoryName: "Psychology", books: [] },
    { categoryName: "Leadership", books: [] },
    { categoryName: "Self Development", books: [] },
  ]);

  const [autobiography, psychology, leadership, selfDevelopment] = categories;

  const [adminUser, studentUser, reserveUser] = await User.insertMany([
    {
      userType: "Staff",
      userFullName: "Library Administrator",
      employeeId: "EMP1001",
      age: 34,
      dob: "1992-01-15",
      gender: "Female",
      address: "District Library Office, Visakhapatnam",
      mobileNumber: 9876543210,
      email: "admin@library.gov.in",
      password: await bcrypt.hash(DEFAULT_PASSWORD, 10),
      isAdmin: true,
      points: 0,
    },
    {
      userType: "Student",
      userFullName: "Aarav Sharma",
      admissionId: "STU1001",
      age: 19,
      dob: "2006-03-12",
      gender: "Male",
      address: "Government Degree College, Visakhapatnam",
      mobileNumber: 9123456780,
      email: "aarav.sharma@example.gov.in",
      password: await bcrypt.hash(DEFAULT_PASSWORD, 10),
      isAdmin: false,
      points: 120,
    },
    {
      userType: "Student",
      userFullName: "Ananya Iyer",
      admissionId: "STU1002",
      age: 20,
      dob: "2005-08-22",
      gender: "Female",
      address: "Municipal Higher Secondary School, Visakhapatnam",
      mobileNumber: 9012345678,
      email: "ananya.iyer@example.gov.in",
      password: await bcrypt.hash(DEFAULT_PASSWORD, 10),
      isAdmin: false,
      points: 80,
    },
  ]);

  const books = await Book.insertMany([
    {
      bookName: "Wings Of Fire",
      alternateTitle: "",
      author: "A. P. J. Abdul Kalam",
      bookCountAvailable: 2,
      language: "English",
      publisher: "University Press",
      bookStatus: "Available",
      categories: [autobiography._id],
      transactions: [],
    },
    {
      bookName: "The Power Of Your Subconscious Mind",
      alternateTitle: "",
      author: "Joseph Murphy",
      bookCountAvailable: 3,
      language: "English",
      publisher: "Prentice Hall",
      bookStatus: "Available",
      categories: [psychology._id, selfDevelopment._id],
      transactions: [],
    },
    {
      bookName: "Elon Musk",
      alternateTitle: "Tesla, SpaceX, and the Quest for a Fantastic Future",
      author: "Ashlee Vance",
      bookCountAvailable: 3,
      language: "English",
      publisher: "HarperCollins",
      bookStatus: "Available",
      categories: [leadership._id],
      transactions: [],
    },
    {
      bookName: "The Subtle Art Of Not Giving A F*ck",
      alternateTitle: "",
      author: "Mark Manson",
      bookCountAvailable: 5,
      language: "English",
      publisher: "Harper",
      bookStatus: "Available",
      categories: [selfDevelopment._id],
      transactions: [],
    },
  ]);

  const [wings, subconscious, elon, subtle] = books;

  const issuedTransaction = await BookTransaction.create({
    bookId: wings._id.toString(),
    borrowerId: studentUser.admissionId,
    bookName: wings.bookName,
    borrowerName: studentUser.userFullName,
    transactionType: "Issued",
    fromDate: "06/10/2026",
    toDate: "06/25/2026",
    returnDate: "",
    transactionStatus: "Active",
  });

  const reservedTransaction = await BookTransaction.create({
    bookId: subconscious._id.toString(),
    borrowerId: reserveUser.admissionId,
    bookName: subconscious.bookName,
    borrowerName: reserveUser.userFullName,
    transactionType: "Reserved",
    fromDate: "06/20/2026",
    toDate: "06/30/2026",
    returnDate: "",
    transactionStatus: "Active",
  });

  const completedTransaction = await BookTransaction.create({
    bookId: subtle._id.toString(),
    borrowerId: studentUser.admissionId,
    bookName: subtle.bookName,
    borrowerName: studentUser.userFullName,
    transactionType: "Issued",
    fromDate: "05/01/2026",
    toDate: "05/15/2026",
    returnDate: "05/14/2026",
    transactionStatus: "Completed",
  });

  await Promise.all([
    Book.findByIdAndUpdate(wings._id, {
      $set: { transactions: [issuedTransaction._id] },
      $inc: { bookCountAvailable: 0 },
    }),
    Book.findByIdAndUpdate(subconscious._id, {
      $set: { transactions: [reservedTransaction._id] },
    }),
    Book.findByIdAndUpdate(elon._id, {
      $set: { transactions: [] },
    }),
    Book.findByIdAndUpdate(subtle._id, {
      $set: { transactions: [completedTransaction._id] },
    }),
    User.findByIdAndUpdate(studentUser._id, {
      $set: {
        activeTransactions: [issuedTransaction._id],
        prevTransactions: [completedTransaction._id],
      },
    }),
    User.findByIdAndUpdate(reserveUser._id, {
      $set: {
        activeTransactions: [reservedTransaction._id],
        prevTransactions: [],
      },
    }),
    BookCategory.findByIdAndUpdate(autobiography._id, {
      $set: { books: [wings._id] },
    }),
    BookCategory.findByIdAndUpdate(psychology._id, {
      $set: { books: [subconscious._id] },
    }),
    BookCategory.findByIdAndUpdate(leadership._id, {
      $set: { books: [elon._id] },
    }),
    BookCategory.findByIdAndUpdate(selfDevelopment._id, {
      $set: { books: [subconscious._id, subtle._id] },
    }),
  ]);

  console.log("Demo data seeded successfully.");
  console.log("Admin login: EMP1001 / TestPass@123");
  console.log("Student login: STU1001 / TestPass@123");
  console.log("Student login: STU1002 / TestPass@123");

  await mongoose.disconnect();
}

seedDemoData().catch(async (err) => {
  console.error(err);
  await mongoose.disconnect().catch(() => {});
  process.exit(1);
});