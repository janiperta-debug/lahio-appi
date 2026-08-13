import React, { createContext, useContext, useState } from 'react';

const fi = {
  common: { loading: 'Ladataan...', save: 'Tallenna', cancel: 'Peruuta', delete: 'Poista', close: 'Sulje', search: 'Hae', send: 'Lähetä', back: 'Takaisin', all: 'Kaikki', error: 'Virhe', success: 'Onnistui', confirm: 'Vahvista', edit: 'Muokkaa', report: 'Ilmianna', contact: 'Ota yhteyttä', free: 'Ilmainen', new_label: 'Uusi' },
  auth: { login: 'Kirjaudu', register: 'Rekisteröidy', email: 'Sähköposti', password: 'Salasana', display_name: 'Näyttönimi', login_title: 'Tervetuloa takaisin', register_title: 'Liity Lähellään', no_account: 'Ei tiliä vielä?', has_account: 'Onko jo tili?', login_error: 'Väärä sähköposti tai salasana', register_error: 'Rekisteröinti epäonnistui' },
  onboarding: { welcome: 'Tervetuloa Lähellään!', subtitle: 'Kerro sijaintisi löytääksesi naapurit läheltäsi', address: 'Kotiosoite', city: 'Kaupunki', radius: 'Hakusäde', radius_hint: 'Isommissa kaupungeissa pienempi säde riittää', set_location: 'Aseta sijainti', use_gps: 'Käytä sijaintia', km: 'km' },
  tabs: { neighbours: 'Naapurit', events: 'Tapahtumat', map: 'Kartta', messages: 'Viestit', profile: 'Profiili' },
  neighbours: { title: 'Naapurit', radius_label: 'säde', play_companions: 'Leikkikaverit', help_available: 'Apua tarjolla', hobbies: 'Harrastukset', seniors: 'Seniorit', pets: 'Lemmikkejä', help_section: 'Naapuriapu', neighbours_section: 'Naapurit', active_today: 'Aktiivinen tänään', yesterday: 'Eilen', days_ago: 'päivää sitten', area_stats: 'Lähialueesi tilanne', neighbours_count: 'Naapuria', new_count: 'Uutta', recent_activity: 'Viimeinen toiminta' },
  help: { title: 'Naapuriapu', ask_help: 'Pyydä apua', offer_help: 'Tarjoa apua', requests: 'Pyyntöjä', offers: 'Tarjoaa apua', helped: 'Autettua', household: 'Kotityöt', shopping: 'Kauppa-asiat', rides: 'Kyyditys', repairs: 'Korjaukset', pet_care: 'Lemmikkihoito', snow: 'Lumilapiointi', garden: 'Puutarha', other: 'Muu', urgent: 'Kiireellinen', helpers: 'Apua tarjoavat', add_request: 'Lisää pyyntö' },
  events: { title: 'Tapahtumat', upcoming: 'tulossa', for_kids: 'Lapsille', sports: 'Liikunta', culture: 'Kulttuuri', gathering: 'Kokoontuminen', participants: 'osallistujaa', open_for_all: 'Auki kaikille', for_families: 'Perheille', this_week: 'Tällä viikolla', all_free: 'Kaikki ilmaisia', signed_up: 'Ilmoittautunut', organize: 'Järjestä oma tapahtuma', organize_desc: 'Järjestätkö jotain lähialueella? Lisää tapahtuma ja kutsu naapurit mukaan!', add_event: 'Lisää tapahtuma', going: 'Osallistun', maybe: 'Ehkä', not_going: 'En osallistu', event_detail: 'Tapahtuman tiedot' },
  map: { title: 'Kartta', playgrounds: 'Leikkipaikat', sports: 'Liikunta', nature: 'Luonto', swimming: 'Uinti', pets_places: 'Lemmikit', culture_places: 'Kulttuuri', legend: 'Selite', your_location: 'Sijaintisi', listing: 'Ilmoitus', places_nearby: 'kohdetta', radius_label: 'säde' },
  messages: { title: 'Viestit', no_messages: 'Ei viestejä vielä', type_message: 'Kirjoita viesti...', start_chat: 'Aloita keskustelu' },
  profile: { title: 'Profiili', my_profile: 'Oma profiili', my_listings: 'Omat ilmoitukset', my_events: 'Omat tapahtumat', location_status: 'Sijainti', location_locked: 'Sijainti lukittu', lock_days: 'päivää', settings: 'Asetukset', language: 'Kieli', update_location: 'Päivitä sijainti', logout: 'Kirjaudu ulos', play_listings: 'Leikkikaverit', help_listings: 'Naapuriapu', events_count: 'Tapahtumat', bio: 'Kuvaus', edit_profile: 'Muokkaa profiilia' },
  create: { listing_title: 'Uusi ilmoitus', event_title: 'Uusi tapahtuma', title: 'Otsikko', description: 'Kuvaus', category: 'Kategoria', child_age: 'Lapsen ikä', min_age: 'Min ikä', max_age: 'Max ikä', tags: 'Tagit', tags_hint: 'Erota pilkulla', help_type: 'Tyyppi', request: 'Pyydän apua', offer: 'Tarjoan apua', location_address: 'Tapahtumapaikka', start_time: 'Alkaa', end_time: 'Loppuu', max_participants: 'Max osallistujat', publish: 'Julkaise', location_locked_msg: 'Sijainti on lukittu. Et voi luoda ilmoituksia muuttolukituksen aikana.' },
};

const en: typeof fi = {
  common: { loading: 'Loading...', save: 'Save', cancel: 'Cancel', delete: 'Delete', close: 'Close', search: 'Search', send: 'Send', back: 'Back', all: 'All', error: 'Error', success: 'Success', confirm: 'Confirm', edit: 'Edit', report: 'Report', contact: 'Contact', free: 'Free', new_label: 'New' },
  auth: { login: 'Log in', register: 'Sign up', email: 'Email', password: 'Password', display_name: 'Display name', login_title: 'Welcome back', register_title: 'Join Lähellä', no_account: "Don't have an account?", has_account: 'Already have an account?', login_error: 'Wrong email or password', register_error: 'Registration failed' },
  onboarding: { welcome: 'Welcome to Lähellä!', subtitle: 'Set your location to find neighbours near you', address: 'Home address', city: 'City', radius: 'Search radius', radius_hint: 'Larger cities need smaller radius', set_location: 'Set location', use_gps: 'Use my location', km: 'km' },
  tabs: { neighbours: 'Neighbours', events: 'Events', map: 'Map', messages: 'Messages', profile: 'Profile' },
  neighbours: { title: 'Neighbours', radius_label: 'radius', play_companions: 'Play companions', help_available: 'Help available', hobbies: 'Hobbies', seniors: 'Seniors', pets: 'Pets', help_section: 'Neighbour help', neighbours_section: 'Neighbours', active_today: 'Active today', yesterday: 'Yesterday', days_ago: 'days ago', area_stats: 'Your area', neighbours_count: 'Neighbours', new_count: 'New', recent_activity: 'Recent activity' },
  help: { title: 'Neighbour help', ask_help: 'Ask for help', offer_help: 'Offer help', requests: 'Requests', offers: 'Offers', helped: 'Helped', household: 'Household', shopping: 'Shopping', rides: 'Rides', repairs: 'Repairs', pet_care: 'Pet care', snow: 'Snow removal', garden: 'Garden', other: 'Other', urgent: 'Urgent', helpers: 'Helpers available', add_request: 'Add request' },
  events: { title: 'Events', upcoming: 'upcoming', for_kids: 'For kids', sports: 'Sports', culture: 'Culture', gathering: 'Gathering', participants: 'participants', open_for_all: 'Open for all', for_families: 'For families', this_week: 'This week', all_free: 'All free', signed_up: 'Signed up', organize: 'Organize your own event', organize_desc: 'Organizing something nearby? Add an event and invite your neighbours!', add_event: 'Add event', going: 'Going', maybe: 'Maybe', not_going: 'Not going', event_detail: 'Event details' },
  map: { title: 'Map', playgrounds: 'Playgrounds', sports: 'Sports', nature: 'Nature', swimming: 'Swimming', pets_places: 'Pets', culture_places: 'Culture', legend: 'Legend', your_location: 'Your location', listing: 'Listing', places_nearby: 'places', radius_label: 'radius' },
  messages: { title: 'Messages', no_messages: 'No messages yet', type_message: 'Type a message...', start_chat: 'Start a conversation' },
  profile: { title: 'Profile', my_profile: 'My profile', my_listings: 'My listings', my_events: 'My events', location_status: 'Location', location_locked: 'Location locked', lock_days: 'days', settings: 'Settings', language: 'Language', update_location: 'Update location', logout: 'Log out', play_listings: 'Play companions', help_listings: 'Neighbour help', events_count: 'Events', bio: 'Bio', edit_profile: 'Edit profile' },
  create: { listing_title: 'New listing', event_title: 'New event', title: 'Title', description: 'Description', category: 'Category', child_age: 'Child age', min_age: 'Min age', max_age: 'Max age', tags: 'Tags', tags_hint: 'Separate with comma', help_type: 'Type', request: 'Need help', offer: 'Offer help', location_address: 'Event location', start_time: 'Starts', end_time: 'Ends', max_participants: 'Max participants', publish: 'Publish', location_locked_msg: 'Your location is locked. You cannot create listings during the move lock period.' },
};

const translations: Record<string, typeof fi> = { fi, en };

type I18nContextType = {
  language: string;
  setLanguage: (lang: string) => void;
  t: (key: string) => string;
};

const I18nContext = createContext<I18nContextType>({
  language: 'fi', setLanguage: () => {}, t: (k) => k,
});

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState('fi');

  const t = (key: string): string => {
    const keys = key.split('.');
    let value: any = translations[language] || translations.fi;
    for (const k of keys) {
      value = value?.[k];
    }
    return (typeof value === 'string' ? value : key);
  };

  return (
    <I18nContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  return useContext(I18nContext);
}
