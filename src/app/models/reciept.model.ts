// Model of what should be included in each receipt object
export class Receipt {
  constructor(
    public user: string,
    public tripId: string,
    public image: string,
    public price: number,
    public timestamp: Date
  ) {}
}
