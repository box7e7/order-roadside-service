export interface TowQuestions {
    // Define the structure of your TowQuestions here
    // For example:
    isVehicleOperable: boolean | null;
    isVehicleLoaded: boolean | null;
    // Add other relevant fields
  }


  export interface SessionData {
    customer_details: {
      name: string;
      email: string;
      phone: string;
      address: Address;
    };
    metadata: {
      pickupAddress: string;
      dropOffAddress: string;
      service: string;
      carDetails: string;
      distance: string;
      estimatedTime: string;
    };
  }
  
  export interface Address {
    line1?: string;
    line2?: string | null;
    city?: string;
    state?: string;
    postal_code?: string;
    country?: string;
  }
  
  export interface ServiceMetadata {
    pickupAddress: string;
    dropOffAddress: string;
    service: string;
    carMake: string;
    carModel: string;
    carYear: string;
    carColor: string;
    towQuestions: {
      [key: string]: boolean | string | null;
    };
    fullName: string;
    email: string;
    phoneNumber: string;
    distance: string;
    estimatedTime: string;
    total: string | number;
  }