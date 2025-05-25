import { NextResponse } from "next/server";
import { Dex } from "@pkmn/dex";
import { Generations } from "@pkmn/data";
import { calculate, Pokemon, Move, Field } from "@smogon/calc";

export async function POST(request) {
  const { attacker, defender, move, field} = await request.json();
  const gens = new Generations(Dex);
  const gen = gens.get(9);
  const result = await calculate(
    gen,
    new Pokemon(gen, attacker.name, 
        {
            level:attacker.level,
            ability:attacker.ability,
            evs:{atk:attacker.evs.atk}
        }
    ),
    new Pokemon(gen, defender.name,
        {
            level:defender.level,
            ability:defender.ability
        }
    ),
    new Move(gen, move.name),
    new Field({weather:field.weather})
  )
  console.log(result)

  return NextResponse.json({ damage:result.damage,status: "200" });
}
