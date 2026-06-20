export interface TThing {
  uid: string;
  name: string;
  imageURI: string;
  latitude: number;
  longitude: number;
  createdAt: string;
  updatedAt: string;
}

export type TUser = {
  id: string;
  email: string;
  username: string;
  isSubscribed: boolean;
  subscriptionEnds: string;
};
