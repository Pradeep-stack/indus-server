import mongoose from "mongoose";
const { Schema } = mongoose;

const DependantsGrantsSchema = new Schema({
  dReferenceNumber: {
    type: Number,
  },
  dGrantName: {
    type: String,
  },
  dGrantDOB: {
    type: String,
  },
  dContectAdd: {
    type: String,
  },
  dPostalCode: {
    type: String,
  },
});

const ChildInfo = new Schema({
  fullName: {
    type: String,
    // required: true,
  },
  relationToYou: {
    type: String,
    // required: true,
  },
  childDOB: {
    type: String,
    // required: true,
  },
  childLiveWith: {
    type: String,
    // required: true,
  },
  totalIncome: {
    type: Number,
    // required: true,
  },
});
const StudentFinancialSchema = new Schema({
  sfTotalIncome: {
    type: Number,
  },
  sfIncomeSource: {
    type: String,
  },
  sfEmployedBe: {
    type: Boolean,
    default: false,
  },
  sfEmployerBe: {
    type: Boolean,
    default: false,
  },
  sfPayment: {
    type: Number,
  },
  sfPensionFund: {
    type: Boolean,
    default: false,
  },
  sfPensionFundTotal: {
    type: Number,
  },
  sfDependentChild: [ChildInfo],
});

const ParentChildInfo = new Schema({
  forneName: {
    type: String,
  },
  surname: {
    type: String,
  },
  dob: {
    type: String,
  },
  careStartDate: {
    type: String,
  },
});
const ParentsGrantSchema = new Schema({
  Under25: {
    type: Boolean,
    default: false,
  },
  yourEstimatedIncome: {
    type: Number,
  },
  patnerEstimatedIncome: {
    type: Number,
  },
  yourCredit: {
    type: Number,
  },
  patnerCredit: {
    type: Number,
  },
  applyGrant: {
    type: Boolean,
    default: false,
  },
  hmHmrc: {
    type: Boolean,
    default: false,
  },
  parentChildInfo: [ParentChildInfo],
  rUAFAdultGrant: {
    type: Boolean,
    default: false,
  },
  adultDependantName: {
    type: String,
  },
  adultDependant: {
    type: String,
    enum: [
      "Your Husband",
      "Your Wife",
      "Your Civil partner",
      "Your Partner",
      "Other",
    ],
  },
  otherAdultDependent: {
    type: Boolean,
    default: false,
  },
  allIncome: {
    type: Number,
  },
  allPensionIncome: {
    type: Number,
  },
  allGrossIncome: {
    type: Number,
  },
  stateBenefits: {
    type: Number,
  },
  allTaxableIncom: {
    type: Number,
  },
  avcs: {
    type: Number,
  },
  taxRelief: {
    type: Number,
  },
});

const DeclarationSchema = new Schema({
  fullNameInC: {
    type: String,
  },
  signature: {
    type: String,
  },
  todayDate: {
    type: String,
  },
  additonalNotes: {
    type: String,
  },
});
const ApplicationSchema = new Schema(
  {
    dependantGrantsInfo: DependantsGrantsSchema,
    studentFinancial: StudentFinancialSchema,
    parentsGrant: ParentsGrantSchema,
    declaration: DeclarationSchema,
    centerId: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    email: {
      type: String,
      required: true,
    },
    contact: {
      type: Number,
    },
    status: {
      type: String,
      enum: ["Accept", "Pending", "Reject", "Under Review"],
      default:"Under Review"
    },
    name: {
      type: String,
    },
    funding: {
      type: String,
      enum: ["Yes", "No"],
    },
  },
  {
    timestamps: true,
  }
);

export const Application = mongoose.model("Application", ApplicationSchema);
