import { postType, userRole } from '@/types/schema.type';
import { sql } from 'drizzle-orm';
import { boolean, timestamp } from 'drizzle-orm/mysql-core';

export const timestamps = {
  createdAt: timestamp('created_at').default(sql`(now())`),
  updatedAt: timestamp('updated_at')
    .default(sql`(now())`)
    .onUpdateNow(),
};

export const room_amenities = {
  hasFurniture: boolean('has_furniture').default(false),
  hasAirConditioner: boolean('has_air_conditioner').default(false),
  hasWashingMachine: boolean('has_washing_machine').default(false),
  hasRefrigerator: boolean('has_refrigerator').default(false),
  hasPrivateBathroom: boolean('has_private_bathroom').default(false),
  hasParking: boolean('has_parking').default(false),
  hasSecurity: boolean('has_security').default(false),
  hasElevator: boolean('has_elevator').default(false),
  hasInternet: boolean('has_internet').default(false),
  allowPets: boolean('allow_pets').default(false),
};

export const checkUserAndPostPermission = (role: string, type: string) => {
  if (role === userRole.LANDLORD && type === postType.RENTAL) {
    return true;
  }
  if (role === userRole.RENTER && [postType.JOIN, postType.PASS, postType.WANTED].includes(type as postType)) {
    return true;
  }
  return false;
};
