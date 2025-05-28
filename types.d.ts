export type User = {
  uid: string;
  name: string;
  image: string;
  phone: string;
  email: string;
  tag: string;
};

export type Message = {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  created_at: string;
};
