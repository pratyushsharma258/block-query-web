"use client";

import prisma from "@/lib/prisma";
import { useUser } from "@clerk/nextjs";
import { JSX } from "react";

export default function Home(): JSX.Element {
  const user = useUser();

  return (
    <div
      className="w-auto bg-red-500 h-screen flex flex-col flex-grow items-center justify-center"
      id="main-div"
    >
      Lorem ipsum, dolor sit amet consectetur adipisicing elit. Quod, cum iusto
      dolorem sint cupiditate omnis? Nam a dolor explicabo animi. Ipsum
      voluptatem quas quidem facilis laboriosam officia voluptate totam tempore
      reprehenderit voluptatum minus soluta quae quaerat odit, et saepe
      laudantium alias placeat ipsam quasi itaque esse fugit eius! Cum, iure
      perspiciatis. Aut, voluptas similique et suscipit modi sint dolore ab
      recusandae! Facilis officiis nihil ad quo? Doloremque distinctio in
      impedit sunt sit voluptatem obcaecati, nostrum id minima? Suscipit quos
      unde modi quidem ut fugiat aut mollitia qui nostrum inventore, beatae
      voluptate quas porro, libero corrupti labore voluptatibus rem, expedita
      nobis quae soluta numquam rerum doloribus minima! Reprehenderit voluptas
      sint velit praesentium ab quos dolores beatae repellendus illum itaque
      corrupti accusamus corporis vero nam, quia eveniet dicta repellat error
      numquam provident, officiis eum cumque facere id? Rem, vero voluptatem
      impedit eius perspiciatis quas, incidunt ea officiis quidem expedita
      dolore minus voluptates. Quia perferendis dignissimos temporibus tempore
      adipisci et cupiditate voluptas eum ea, nemo rerum molestiae sunt earum
      ullam quasi voluptates beatae perspiciatis? Similique quibusdam a veniam
      ea perspiciatis ipsum provident ut non dicta cum vitae expedita ex velit
      nemo debitis veritatis, voluptatum, incidunt recusandae vel animi. Eum
      pariatur libero asperiores suscipit. Quis obcaecati saepe repudiandae
      fugiat adipisci quos dolorem quasi dolores sit minus distinctio ut porro,
      pariatur harum non nostrum impedit laborum voluptatibus a qui esse
      molestias nihil molestiae fugit? Distinctio ad aperiam asperiores nam
      numquam in voluptatem voluptas sed, culpa commodi modi, perspiciatis
      inventore, et iure labore. Explicabo fugiat ullam dicta ex sit qui iusto
      minus a vero debitis eligendi, hic magnam eos voluptatem officia tempore
      velit ab iste adipisci? Ut explicabo porro fugiat eveniet accusantium quos
      aliquid laudantium! Praesentium, quas corporis culpa hic quos saepe labore
      aut laborum fugiat. Fugiat libero incidunt earum pariatur veniam, quod,
      qui vitae labore hic nulla doloribus vero dolore molestiae sunt optio, at
      a? Enim eaque laboriosam aspernatur consequatur repellat in necessitatibus
      harum, a hic? Consectetur quo nobis totam mollitia praesentium accusantium
      deserunt iusto, repellat sapiente suscipit, sunt repellendus. Doloremque
      repellat beatae natus voluptas aliquam? Voluptatem voluptatibus laudantium
      et error sed unde aliquam quo odit, adipisci maiores illum, reiciendis
      voluptas dolores doloribus commodi aliquid iusto expedita sunt nam
      obcaecati ea ex nobis maxime provident! Eos incidunt numquam, aliquam
      voluptatem voluptate inventore, deleniti impedit voluptates distinctio
      voluptatibus sint quidem aut totam laboriosam reprehenderit eaque ratione!
      Repellendus nulla porro quam dolorum! Pariatur deserunt fugit harum cum?
      Tenetur reiciendis laudantium eos magnam, sit accusamus accusantium ipsa
      sapiente ipsum, blanditiis corporis, consequuntur iusto doloremque
      distinctio voluptates ullam. Voluptate facilis, consequuntur harum eos
      neque impedit placeat deleniti. Assumenda, pariatur nobis quibusdam fugiat
      corporis cumque asperiores molestias doloribus. Optio animi ipsum dolore
      laudantium illo! Eaque eum architecto atque consequatur hic explicabo,
      voluptas ex nemo rem harum libero culpa? Error, autem alias vitae,
      necessitatibus omnis possimus ipsa nostrum maiores eveniet doloribus porro
      impedit, consectetur officia architecto laudantium accusantium similique
      accusamus molestiae reprehenderit. Nesciunt, officia quaerat officiis at
      reprehenderit sunt nostrum fugiat laudantium illo, optio earum tenetur
      totam quia debitis sapiente ex.
      <div id="sidebar-div"></div>
      <div id="content-div"></div>
    </div>
  );
}
