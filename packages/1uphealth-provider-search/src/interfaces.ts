// Health Systems
export interface HealthSystemI {
  api_version: string;
  id: number;
  logo: string;
  name: string;
  resource_url: string;
  status: string;
  locations: HealthSystemAddressI[];
}

interface HealthSystemAddressI {
  name: string;
  address: {
    city: string;
    postalCode: string;
    state: string;
    line: string[];
  };
}

// Organizations
export interface FHIROrganizationI {
  fullUrl: string;
  resource: {
    id: string;
    name: string;
    resourceType: string;
    active: boolean;
    address: FHIROrganizationAddressI[];
    extension: FHIROrganizationExtensionI[];
    identifier: OrganizationIdentifierI[];
    meta: {
      lastUpdated: string;
      versionId: string;
    };
    telecom: FHIROrganizationTelecomI[];
    type: {
      coding: FHIROrganizationTypeCodingI[];
    };
  };
  search: {
    mode: string;
    score: number;
  };
}

export interface OrganizationIdentifierI {
  system: string;
  use: string;
  value: string;
}

interface FHIROrganizationAddressI {
  city: string;
  country: string;
  line: string[];
  state: string;
  use: string;
}

interface FHIROrganizationExtensionI {
  url: string;
  valueUri: string;
}

interface FHIROrganizationTelecomI {
  system: string;
  use: string;
  value: string;
}

interface FHIROrganizationTypeCodingI {
  code: string;
  display: string;
  system: string;
}

// Filtered data
export interface FilteredDataObjectI {
  id: number;
  logo: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zipcode: string;
}
