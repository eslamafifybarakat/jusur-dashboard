export const roots = {
  auth: {
    login: 'User/Login',
    currentUserInformation: '/User/GetCurrentLoginInformations',

    forgetPassword: '/Account/ForgetPassword',
    validateCode: '/Account/ValidateCode',
    resetPassword: '/Account/ResetPassword',
    updateProfile: '/Profile/UpdatePersonalData',
    profileData: '/Profile/UpdatePersonalData',
    changePassword: '/User/ChangePassword',

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
  client: {
    addNote: 'Note/AddNote',
  },
  dashboard: {
    availability: {
      IsNationalIdentityAvailable: "Client/IsIdentityAvailable",
      IsEmailAvailable: "Client/IsEmailAvailable",
      IsPhoneAvailable: "Client/IsPhoneNumberAvailable",
      IsRecordNumberAvailable: "ClientHistory/IsNumberAvailable",
      IsOperatingCardAvailable: "Employee/IsIdentityAvailable",
      IsResidencyNumberAvailable: 'Employee/IsIdentityAvailable'
    },
    clients: {
      getClients: 'Client/AllClients',
      getSingleClient: 'Client/GetSingleClient',
      addClient: 'Client/AddClient',
      editClient: '/Client/UpdateClient',
      deleteClients: '/deleteClients',
      toggleActivateClientAccount: 'Client/ToggleActivation'
    },
    records: {
      getRecords: 'ClientHistory/AllClientHistorys',
      getSingleHistory: 'ClientHistory/GetSingleHistory',
      addRecords: 'ClientHistory/AddClientHistory',
      editRecords: 'ClientHistory/UpdateClientHistory'
    },
    notes: {
      getNotes: 'Note/GetAllClientNotes',
    },
    employees: {
      getEmployees: 'Employee/AllEmployees',
      addEmployee: 'Employee/AddEmployee',
      editEmployee: 'Employee/UpdateEmployee',
      deleteEmployee: 'Employee/DeleteEmployee'
    },
    vehicles: {
      getVehicles: 'Car/AllCars',
      addVehicle: 'Car/AddCar',
      editVehicle: 'Car/UpdateCar'
    }
  }
}
