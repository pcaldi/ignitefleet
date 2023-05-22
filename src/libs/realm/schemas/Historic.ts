import { Realm } from '@realm/react';

type GenerateProps = {
  user_id: string;
  description: string;
  license_plate: string;
};

export class Historic extends Realm.Object<Historic> {
  _id!: string;
  user_id!: string;
  description!: string;
  status!: string;
  license_plate!: string;
  created_at!: Date;
  updated_at!: Date;
  // Passando o "!" no final da palavra indica que o campo será utilizado,
  // sendo assim, não precisa instanciar o construction.
  static generate({ user_id, description, license_plate }: GenerateProps) {
    return {
      _id: new Realm.BSON.UUID(),
      user_id,
      description,
      license_plate,
      status: 'departure',
      created_at: new Date(),
      updated_at: new Date(),
    };
  }

  static schema = {
    name: 'Historic',
    primaryKey: '_id',
    properties: {
      _id: 'uuid',
      user_id: {
        type: 'string',
        indexed: true,
      },
      license_plate: 'string',
      description: 'string',
      status: 'string',
      created_at: 'date',
      updated_at: 'date',
    },
  };
}
