import { Dex } from "@pkmn/dex";
import { Generations } from "@pkmn/data";
import { calculate, Pokemon, Move, Field } from "@smogon/calc";

export async function calcDamageCore(payload) {
  const { attacker, defender, move, field} = payload
  const gens = new Generations(Dex);
  const gen = gens.get(9);
  const result = await calculate(
    gen,
    new Pokemon(gen, attacker.name, attacker.options),
    new Pokemon(gen, defender.name, defender.options),
    new Move(gen, move.name, move.options),
    new Field(field)
  )
  return { damage:result.damage};
}