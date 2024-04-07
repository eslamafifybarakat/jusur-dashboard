export interface NavItem {
  title: string;
  label: string;
  route: string;
  icon?: string;
  logout?: boolean;
  children?: NavItem[]; // Optional array of NavItem for nested navigation
}

export const navItems = [
  { title: 'nav.home', label: 'nav.home', route: '/Home', icon: '' },
  {
    title: 'nav.services.title',
    label: 'nav.services.title',
    route: '/Services',
    icon: '',
    children: [
      {
        title: 'nav.services.items.offices',
        label: 'nav.services.items.offices',
        route: '/Services/Offices',
        icon: ''
      },
      {
        title: 'nav.services.items.sponsorshipTransfer',
        label: 'nav.services.items.sponsorshipTransfer',
        route: '/Services/SponsorshipTransfer',
        icon: ''
      }
    ]
  },
  {
    title: 'nav.aboutStructure.title',
    label: 'nav.aboutStructure.title',
    route: '/AboutStructure',
    icon: '',
    children: [
      {
        title: 'nav.aboutStructure.items.policies',
        label: 'nav.aboutStructure.items.policies',
        route: '/Services/Policies',
        icon: ''
      },
      {
        title: 'nav.aboutStructure.items.journey',
        label: 'nav.aboutStructure.items.journey',
        route: '/Services/Journey',
        icon: ''
      }
    ]
  },
  {
    title: 'nav.support.title',
    label: 'nav.support.title',
    route: '/Support',
    icon: '',
    children: [
      {
        title: 'nav.support.items.contactUs',
        label: 'nav.support.items.contactUs',
        route: '/Services/ContactUs',
        icon: ''
      },
      {
        title: 'nav.support.items.faqs',
        label: 'nav.support.items.faqs',
        route: '/Services/FAQs',
        icon: ''
      }
    ]
  },
  {
    title: 'Dashboard',
    label: 'Dashboard',
    route: '/Dashboard',
    icon: '',
    children: [
      {
        title: 'DashboardV1',
        label: 'DashboardV1',
        route: '/Dashboard',
        icon: ''
      },
      {
        title: 'DashboardV2',
        label: 'DashboardV2',
        route: '/Dashboard-V2',
        icon: ''
      }
    ]
  }
];
