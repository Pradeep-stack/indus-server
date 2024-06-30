import mongoose, { Schema } from 'mongoose';

// Define FundingClaimDetails schema
const providerAScehma = new Schema({
  providerAName: String,
  startDateA: String,
  hoursPerWeekA: String,
  fundingTermA:{ type: String, enum: ['fullTerm', 'halfTerm', 'termTime','fullYear'] },
  fundedHoursA: String,
});
const providerBScehma = new Schema({
  providerBName: String,
  startDateB: String,
  hoursPerWeekB: String,
  fundingTermB:{ type: String, enum: ['fullTerm', 'halfTerm', 'termTime','fullYear'] },
  fundedHoursB: String,
});
const providerCScehma = new Schema({
  providerCName: String,
  startDateC: String,
  hoursPerWeekC: String,
  fundingTermC:{ type: String, enum: ['fullTerm', 'halfTerm', 'termTime','fullYear'] },
  fundedHoursC: String,
});

// Define AppropriateFundingTerm schema
const appropriateFundingTermSchema = new Schema({
  fundingTerm: String,
  fParentSignature: String,
  fproviderSignature: String,
  fundingDate: String, // Changed from Boolean to String based on likely use case
});

// Define ParentDeclaration schema
const parentDeclarationSchema = new Schema(
  {
    twoYearOld: { type: String },
    sixDigitCodeCYC: String, // Changed from Number to String to match input data
    twoYearOldWorkParent: { type: String },
    elevenDigitCodeCYC: String, // Changed from Number to String to match input data
    threeAndFourUH: { type: String },
    threeAndFourEH: { type: String  },
    elevenDigitCodeCC: String, // Changed from Number to String to match input data
    forename: String,
    surname: String,
    dob: String,
    address: String,
    ethnicity: String,
    entitlementType:String,
    gender: { type: String, enum: ['Male', 'Female', 'Other'] },
    confirmDOB: { type: Boolean, default: false },
    birthCertificate: { type: String },
    agreeOne : { type: Boolean, default: false },
    agreeTwo : { type: Boolean, default: false },
    agreeThree : { type: Boolean, default: false },
    agreeFour : { type: Boolean, default: false },
    agreeFive : { type: Boolean, default: false },
    agreeSix : { type: Boolean, default: false },
    providerSignature: String,
    dateRecorded: String,
    parentsForename: String,
    parentsSurname: String,
    nationalInsuranceNumber: Number,
    parentsDateofbirth: String,
    providerA: [providerAScehma],
    providerB: [providerBScehma],
    providerC: [providerCScehma],
    termlyFundedHours: String,
    applyForEYPP: { type: Boolean, default: false },
    daf: { type: Boolean, default: false },
    livingAllowanceDLA: { type: Boolean, default: false },
    accurateAndTrue: { type: Boolean, default: false },
    privacyNotice: { type: Boolean, default: false },
    aboveTheEntitlement: { type: Boolean, default: false },
    fundedEntitlement: { type: Boolean, default: false },
    chargesOrServices: { type: Boolean, default: false },
    currentProvider: { type: Boolean, default: false },
    parentSignature: String,
    parentSDate: String,
    centerId: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    email: String,
    contact: Number,
    status: { type: String, enum: ['Accept', 'Pending', 'Reject', 'Under Review'], default: 'Under Review' },
    name: String,
    funding: { type: String, enum: ['Yes', 'No'] },
    appropriateFundingTerm: [appropriateFundingTermSchema],
  },
  { timestamps: true }
);

export const ParentDeclaration = mongoose.model('ParentDeclaration', parentDeclarationSchema);
