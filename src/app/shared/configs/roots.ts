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
      IsPhoneAvailable: "Client/IsPhoneNumberAvailable",
      IsRecordNumberAvailable: "ClientHistory/IsNumberAvailable",
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
      getSingleHistory: 'ClientHistory/GetSingleHistory',
      addRecords: 'ClientHistory/AddClientHistory',
      editRecords: 'ClientHistory/UpdateClientHistory'
    },
    employees: {
      getEmployees: 'Employee/AllEmployees',
      addEditEmployee: '/addEditEmployee'
    },
    vehicles: {
      getVehicles: '/getVehicles',
      addEditVehicle: '/addEditVehicle'
    }
  }
}
