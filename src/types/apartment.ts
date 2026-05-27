export type Apartment = {
  id: string;
  name: string;
  address: string;
  year: string;
};

export type Priority = 1 | 2 | 3 | 4 | 5;

export type Priorities = Record<string, Priority>;

export type MarkerEntry = {
  marker: naver.maps.Marker;
  infoWindow: naver.maps.InfoWindow;
  apt: Apartment;
  map: naver.maps.Map;
};
