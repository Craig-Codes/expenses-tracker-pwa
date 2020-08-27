// Model of what each trip object should look like

export class Trip {
  constructor(
    public user: string,
    public tripId: string,
    public location: string,
    public description: string,
    public dateFrom: Date,
    public dateTo: Date,
    public price: number
  ) {}
}
