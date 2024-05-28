
interface IFirstStepOrder {
  payMethod: string;
  address: string;

  valid: boolean;
	errors: string[];
}