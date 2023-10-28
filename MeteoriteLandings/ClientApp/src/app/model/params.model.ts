export class Params {
  continents!: string[];
  minMass!: number;
  maxMass!: number;
  minDate!: number;
  maxDate!: number;
  isSorted!: boolean;
  sortedBy!: 'Date' | 'Mass';
  order!: 'Ascending' | 'Descending';
  file!: File;
}
