export const roots = {
  auth: {
    login: 'User/Login',
    currentUserInformation: '/User/GetCurrentLoginInformations',

    forgetPassword: '/Account/ForgetPassword',
    validateCode: '/Account/ValidateCode',
    resetPassword: '/Account/ResetPassword',
    updateProfile: '/Account/UpdateProfile',

    isEmailAvailable: "/Account/IsEmailAvailable",

    isUserNameFound: "/Account/IsUserNameFound",
    isVatIdAvailableRegister: '/Application/IsVatNumberAvailable',
    checkCompanyNameAvailability: 'Supplier/checkCompanyNameAvailability',
    register: "/Application/Register",
  },
  supplier: {
    getCountries: "/Country/GetCountrys",
    getCitiesByCountryId: "/City/GetCitysByCountryId",
  },
  dashboard: {
    availability: {
      IsNationalIdentityAvailable: "Client/IsIdentityAvailable",
      IsEmailAvailable: "Client/IsEmailAvailable",
      IsPhoneAvailable: "Client/IsPhoneNumberAvailable"
    },
    clients: {
      getClients: 'Client/AllClients',
      getSingleClient: 'Client/GetSingleClient',
      addClient: 'Client/AddClient',
      editClient: '/Client/UpdateClient',
      deleteClients: '/deleteClients',
    },
    records: {
      getRecords: 'ClientHistory/AllClientHistorys',
      addRecords: '/addRecords',
      editRecords: '/editRecords',
      IsRecordNumberAvailable: "/RecordNumber",
    },
    employees: {
      getEmployees: '/getEmployees',
      addEditEmployee: '/addEditEmployee'
    },
    vehicles: {
      getVehicles: '/getVehicles',
      addEditVehicle: '/addEditVehicle'
    }
  }
}
