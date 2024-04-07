export const userInfoMenu: any = [
  {
    text: 'userInfo.my_profile',
    icon: `   <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="9" r="3" stroke="black" stroke-width="1.5" />
    <circle cx="12" cy="12" r="10" stroke="black" stroke-width="1.5" />
    <path d="M17.9696 20C17.8105 17.1085 16.9252 15 12.0004 15C7.0757 15 6.1904 17.1085 6.03125 20"
      stroke="black" stroke-width="1.5" stroke-linecap="round" />
  </svg>`,
    routerLink: 'profile'
  },
  {
    text: 'userInfo.my_performance',
    icon: `  <svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.5 22H2.5" stroke="black" stroke-width="1.5" stroke-linecap="round" />
    <path d="M21.5 22V14.5C21.5 13.6716 20.8284 13 20 13H17C16.1716 13 15.5 13.6716 15.5 14.5V22"
      stroke="black" stroke-width="1.5" />
    <path
      d="M15.5 22V5C15.5 3.58579 15.5 2.87868 15.0607 2.43934C14.6213 2 13.9142 2 12.5 2C11.0858 2 10.3787 2 9.93934 2.43934C9.5 2.87868 9.5 3.58579 9.5 5V22"
      stroke="black" stroke-width="1.5" />
    <path d="M9.5 22V9.5C9.5 8.67157 8.82843 8 8 8H5C4.17157 8 3.5 8.67157 3.5 9.5V22" stroke="black"
      stroke-width="1.5" />
  </svg>`,
    routerLink: '/performance'
  },
  {
    text: 'userInfo.my_notes',
    icon: `
    <svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M16.5 4.00171C18.675 4.01382 19.8529 4.11027 20.6213 4.87865C21.5 5.75733 21.5 7.17154 21.5 9.99997V16C21.5 18.8284 21.5 20.2426 20.6213 21.1213C19.7426 22 18.3284 22 15.5 22H9.5C6.67157 22 5.25736 22 4.37868 21.1213C3.5 20.2426 3.5 18.8284 3.5 16V9.99997C3.5 7.17154 3.5 5.75733 4.37868 4.87865C5.14706 4.11027 6.32497 4.01382 8.5 4.00171"
      stroke="black" stroke-width="1.5" />
    <path d="M8.5 14H16.5" stroke="black" stroke-width="1.5" stroke-linecap="round" />
    <path d="M7.5 10.5H17.5" stroke="black" stroke-width="1.5" stroke-linecap="round" />
    <path d="M9.5 17.5H15.5" stroke="black" stroke-width="1.5" stroke-linecap="round" />
    <path
      d="M8.5 3.5C8.5 2.67157 9.17157 2 10 2H15C15.8284 2 16.5 2.67157 16.5 3.5V4.5C16.5 5.32843 15.8284 6 15 6H10C9.17157 6 8.5 5.32843 8.5 4.5V3.5Z"
      stroke="black" stroke-width="1.5" />
  </svg>`,
    routerLink: '/home-page/my-notes'
  },
  {
    text: 'userInfo.rest_schedule',
    icon: `   <svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M2.5 12C2.5 8.22876 2.5 6.34315 3.67157 5.17157C4.84315 4 6.72876 4 10.5 4H14.5C18.2712 4 20.1569 4 21.3284 5.17157C22.5 6.34315 22.5 8.22876 22.5 12V14C22.5 17.7712 22.5 19.6569 21.3284 20.8284C20.1569 22 18.2712 22 14.5 22H10.5C6.72876 22 4.84315 22 3.67157 20.8284C2.5 19.6569 2.5 17.7712 2.5 14V12Z"
      stroke="black" stroke-width="1.5" />
    <path d="M7.5 4V2.5" stroke="black" stroke-width="1.5" stroke-linecap="round" />
    <path d="M17.5 4V2.5" stroke="black" stroke-width="1.5" stroke-linecap="round" />
    <path d="M3 9H22" stroke="black" stroke-width="1.5" stroke-linecap="round" />
    <path
      d="M18.5 17C18.5 17.5523 18.0523 18 17.5 18C16.9477 18 16.5 17.5523 16.5 17C16.5 16.4477 16.9477 16 17.5 16C18.0523 16 18.5 16.4477 18.5 17Z"
      fill="black" />
    <path
      d="M18.5 13C18.5 13.5523 18.0523 14 17.5 14C16.9477 14 16.5 13.5523 16.5 13C16.5 12.4477 16.9477 12 17.5 12C18.0523 12 18.5 12.4477 18.5 13Z"
      fill="black" />
    <path
      d="M13.5 17C13.5 17.5523 13.0523 18 12.5 18C11.9477 18 11.5 17.5523 11.5 17C11.5 16.4477 11.9477 16 12.5 16C13.0523 16 13.5 16.4477 13.5 17Z"
      fill="black" />
    <path
      d="M13.5 13C13.5 13.5523 13.0523 14 12.5 14C11.9477 14 11.5 13.5523 11.5 13C11.5 12.4477 11.9477 12 12.5 12C13.0523 12 13.5 12.4477 13.5 13Z"
      fill="black" />
    <path
      d="M8.5 17C8.5 17.5523 8.05228 18 7.5 18C6.94772 18 6.5 17.5523 6.5 17C6.5 16.4477 6.94772 16 7.5 16C8.05228 16 8.5 16.4477 8.5 17Z"
      fill="black" />
    <path
      d="M8.5 13C8.5 13.5523 8.05228 14 7.5 14C6.94772 14 6.5 13.5523 6.5 13C6.5 12.4477 6.94772 12 7.5 12C8.05228 12 8.5 12.4477 8.5 13Z"
      fill="black" />
  </svg>`,
    routerLink: ''
  },
  {
    text: 'userInfo.sharing_samples',
    icon: `  <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M9.5 12.5C9.5 13.8807 8.38071 15 7 15C5.61929 15 4.5 13.8807 4.5 12.5C4.5 11.1193 5.61929 10 7 10C8.38071 10 9.5 11.1193 9.5 12.5Z"
      stroke="black" stroke-width="1.5" />
    <path d="M14.5 7L9.5 10.5" stroke="black" stroke-width="1.5" stroke-linecap="round" />
    <path d="M14.5 18L9.5 14.5" stroke="black" stroke-width="1.5" stroke-linecap="round" />
    <path
      d="M19.5 19C19.5 20.3807 18.3807 21.5 17 21.5C15.6193 21.5 14.5 20.3807 14.5 19C14.5 17.6193 15.6193 16.5 17 16.5C18.3807 16.5 19.5 17.6193 19.5 19Z"
      stroke="black" stroke-width="1.5" />
    <path
      d="M19.5 6C19.5 7.38071 18.3807 8.5 17 8.5C15.6193 8.5 14.5 7.38071 14.5 6C14.5 4.61929 15.6193 3.5 17 3.5C18.3807 3.5 19.5 4.61929 19.5 6Z"
      stroke="black" stroke-width="1.5" />
  </svg>`,
    routerLink: ''
  },
  {
    text: 'userInfo.control_board',
    icon: `  <svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M3 6.5C3 4.61438 3 3.67157 3.58579 3.08579C4.17157 2.5 5.11438 2.5 7 2.5C8.88562 2.5 9.82843 2.5 10.4142 3.08579C11 3.67157 11 4.61438 11 6.5C11 8.38562 11 9.32843 10.4142 9.91421C9.82843 10.5 8.88562 10.5 7 10.5C5.11438 10.5 4.17157 10.5 3.58579 9.91421C3 9.32843 3 8.38562 3 6.5Z"
      stroke="black" stroke-width="1.5" />
    <path
      d="M14 17.5C14 15.6144 14 14.6716 14.5858 14.0858C15.1716 13.5 16.1144 13.5 18 13.5C19.8856 13.5 20.8284 13.5 21.4142 14.0858C22 14.6716 22 15.6144 22 17.5C22 19.3856 22 20.3284 21.4142 20.9142C20.8284 21.5 19.8856 21.5 18 21.5C16.1144 21.5 15.1716 21.5 14.5858 20.9142C14 20.3284 14 19.3856 14 17.5Z"
      stroke="black" stroke-width="1.5" />
    <path
      d="M3 17.5C3 15.6144 3 14.6716 3.58579 14.0858C4.17157 13.5 5.11438 13.5 7 13.5C8.88562 13.5 9.82843 13.5 10.4142 14.0858C11 14.6716 11 15.6144 11 17.5C11 19.3856 11 20.3284 10.4142 20.9142C9.82843 21.5 8.88562 21.5 7 21.5C5.11438 21.5 4.17157 21.5 3.58579 20.9142C3 20.3284 3 19.3856 3 17.5Z"
      stroke="black" stroke-width="1.5" />
    <path
      d="M14 6.5C14 4.61438 14 3.67157 14.5858 3.08579C15.1716 2.5 16.1144 2.5 18 2.5C19.8856 2.5 20.8284 2.5 21.4142 3.08579C22 3.67157 22 4.61438 22 6.5C22 8.38562 22 9.32843 21.4142 9.91421C20.8284 10.5 19.8856 10.5 18 10.5C16.1144 10.5 15.1716 10.5 14.5858 9.91421C14 9.32843 14 8.38562 14 6.5Z"
      stroke="black" stroke-width="1.5" />
  </svg>`,
    routerLink: '/Dashboard',
    type: 'dashboard'
  },
  {
    text: 'userInfo.logout',
    icon: ` <svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M9.50195 7C9.51406 4.82497 9.61051 3.64706 10.3789 2.87868C11.2576 2 12.6718 2 15.5002 2L16.5002 2C19.3286 2 20.7429 2 21.6215 2.87868C22.5002 3.75736 22.5002 5.17157 22.5002 8L22.5002 16C22.5002 18.8284 22.5002 20.2426 21.6215 21.1213C20.7429 22 19.3286 22 16.5002 22H15.5002C12.6718 22 11.2576 22 10.3789 21.1213C9.61051 20.3529 9.51406 19.175 9.50195 17"
      stroke="#FF5879" stroke-width="1.5" stroke-linecap="round" />
    <path d="M15.5 12L2.5 12M2.5 12L6 9M2.5 12L6 15" stroke="#FF5879" stroke-width="1.5"
      stroke-linecap="round" stroke-linejoin="round" />
  </svg>`,
    routerLink: 'logout'
  },
];
