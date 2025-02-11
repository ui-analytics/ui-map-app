export interface ShowComponents {
  search: boolean;
  legend: boolean;
  directions: boolean;
  logo: boolean;
  navigation: boolean;
  kiosk: boolean;
}

export function initShowComponents(): ShowComponents {
  return {
    search: true,
    legend: true,
    directions: true,
    logo: true,
    navigation: true,
    kiosk: true,
  }
}
