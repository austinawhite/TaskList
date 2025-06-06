import db from "#db/client";

import { createTask } from "#db/queries/tasks";
import { createUser } from "#db/queries/users";

await db.connect();
await seed();
await db.end();
console.log("🌱 Database seeded.");

async function seed() {
  // add users 
  const user1 = await createUser ("Austina_White", "password21");
  const user2 = await createUser ("Sammi Smith", "password21");
  const user3 = await createUser ("Jamie Charles", "password21");

  // add tasks 
  await createTask("Finish Homework", false, user1.id);
  await createTask("Wash laundry", false, user1.id);
  await createTask("Wash dishes", false, user1.id);
  await createTask("Cook dinner", false, user2.id);
  await createTask("Pick up dog from daycare", false, user3.id);
}
