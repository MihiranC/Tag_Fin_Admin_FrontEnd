export class Bank {
    bankCode: string | undefined | null;
    bankName: string | undefined | null;
}

export class BankBranch {
    bankBranchCode: string | undefined | null;
    bankBranchName: string | undefined | null;
}

export class InsertTransfer {
    TransferAccountNo: string | undefined | null;
    ReceiverAccountNo: string | undefined | null;
    FundTransferMode: string | undefined | null;
    FundTransferType: string | undefined | null;
    PayeeAccountType: string | undefined | null;
    PaymentID: number | undefined | null;
    PayeeID: number | undefined | null;
    Amount: string | undefined | null;
    Narration: string | undefined | null;
    TransferMethod: string | undefined | null;
    TransferType: string | undefined | null;
    Bank: string | undefined | null;
    BankBranch: string | undefined | null;
    GLAccountNo: string | undefined | null;
    GLBranch: string | undefined | null;
    ExternalAccountNo: string | undefined | null;
    IBUserID: string | undefined | null;
    Mode: string | undefined | null;
    InvoiceNo: string | undefined | null;
    OTPAvailable: boolean | undefined | null;
    OTP: string | undefined | null;
    FTID: string | undefined | null;
    DeliveryOption: number | undefined | null;
    IsOTPAvailable: boolean | undefined | null;
    FundTransferTxnNo: number | undefined | null;
    StandingOrderID: number | undefined | null;
    BeneficiaryNarration: string | undefined | null;
    AccountType: string | undefined | null;
    OtherDatails: string | undefined | null;
    ScheduleType: string | undefined | null;
    TransactionDate: string | undefined | null;
    Frequency: string | undefined | null;
    TransactionStartDate: string | undefined | null;
    TransactionEndDate: string | undefined | null;

    BankName: string | undefined | null;
    BankBranchName : string | undefined | null;
    PayeeNickName : string | undefined | null;
    AccountName : string | undefined | null;
    
}