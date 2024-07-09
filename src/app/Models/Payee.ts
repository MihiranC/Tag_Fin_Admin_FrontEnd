export class Payee {
    public PayeeAccountType: string | undefined;
    public AccountName: string | undefined;
    public AccountNickName: string | undefined;
    public AccountNo : string | undefined;
    public BankCode: string | undefined;
    public BranchCode: string | undefined;
    public PaymentTypeCode: string | undefined;
    public PaymentTypeDetailID: number | undefined;
    public PayeeID: number | undefined;
    public UserID: string | undefined;
    public TelNo: string | undefined;
    public AccNo: string | undefined;
    public PackageType: string | undefined;
    public PopulateType: string | undefined;
    public AccountType: string | undefined;
    public ActionStatus: string | undefined;
} 

export class PayeeResponse {
    
    public payeeName: string | undefined;
    public payeeNickName: string | undefined;
    public payeeAccountNo: string | undefined;     
    public payeeBank: string | undefined;
    public payeeBankBranch: string | undefined;
    public bankCode: string | undefined;
    public bankName: string | undefined;
    public bankBranchCode: string | undefined;
    public bankBranchName: string | undefined;
    public accountType: string | undefined;
    public payeeID: number | undefined;
}  

      