import React, { useState, useEffect } from "react";
import nookies from "nookies";
import jwt from "jsonwebtoken";

import { MainGrid } from "../src/components/MainGrid";
import { Box } from "../src/components/Box";
import { ProfileRelationsBoxWrapper } from "../src/components/ProfileRelations";
import { AlurakutProfileSidebarMenuDefault } from "../src/lib/AlurakutCommons";

import {
  AlurakutMenu,
  OrkutNostalgicIconSet,
} from "../src/lib/AlurakutCommons";

function ProfileSideBar(props) {
  return (
    <Box as="aside">
      <img
        src={`https://github.com/${props.githubUser}.png`}
        alt="profilepicture"
        style={{ borderRadius: "0.41vw" }}
      />
      <hr />
      <a className="boxLink" href={`https://github.com/${props.githubUser}`}>
        @{props.githubUser}
      </a>
      <hr />
      <AlurakutProfileSidebarMenuDefault />
    </Box>
  );
}

function ProfileRelationsBox({ title, item }) {
  return (
    <>
      <ProfileRelationsBoxWrapper>
        <h2 className="smallTitle">
          {title} ({item.length})
        </h2>
        {/* <ul>
          {item.map((pessoa) => {
            return (
              <li key={pessoa}>
                <a href={`/users/${pessoa}`}>
                  <img src={`https://github.com/${pessoa}.png`} />
                  <span>{pessoa}</span>
                </a>
              </li>
            );
          })}
        </ul> */}
      </ProfileRelationsBoxWrapper>
    </>
  );
}

export default function Home(props) {
  const user = props.githubUser;
  const [comunidades, setComunidades] = useState([]);
  const pessoasFavoritas = ["juunegreiros", "omariosouto", "rafaballerini"];
  const [seguidores, setSeguidores] = useState([]);

  useEffect(() => {
    fetch("https://api.github.com/users/peas/followers")
      .then((repostaDoServidor) => {
        return repostaDoServidor.json();
      })
      .then((respostaCompleta) => {
        setSeguidores(respostaCompleta);
      });

    //fetch pro dato
    fetch("https://graphql.datocms.com/", {
      method: "POST",
      headers: {
        Authorization: "2c3994e34aa7c487693c17a52d387d",
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        query: `{ allComunidades { title id image creatorSlug } }`,
      }),
    })
      .then((response) => response.json())
      .then((respostaCompleta) => {
        const comunidadesDato = respostaCompleta.data.allComunidades;
        setComunidades(comunidadesDato);
      });
  }, []);
  return (
    <>
      <AlurakutMenu githubUser={user} />
      <MainGrid>
        <div className="profileArea" style={{ gridArea: "profileArea" }}>
          <ProfileSideBar githubUser={user} />
        </div>
        <div className="welcomeArea" style={{ gridArea: "welcomeArea" }}>
          <Box>
            <h1 className="title">Bem vindo</h1>
            <OrkutNostalgicIconSet />
          </Box>
          <Box>
            <h2 className="subTitle">O que voc?? deseja fazer?</h2>
            <form
              onSubmit={function handleCriaComunidade(e) {
                e.preventDefault();
                const dadosDoForm = new FormData(e.target);

                const comunidade = {
                  title: dadosDoForm.get("title"),
                  image: dadosDoForm.get("image"),
                  creatorSlug: "guilherme",
                };

                fetch("/api/comunidades", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify(comunidade),
                }).then(async (response) => {
                  const dados = await response.json();
                  const comunidade = dados.registroCriado;
                  const comunidadesAtualizadas = [...comunidades, comunidade];
                  setComunidades(comunidadesAtualizadas);
                  e.target.reset();
                });
              }}
            >
              <div>
                <input
                  type="text"
                  placeholder="Qual vai ser o nome da comunidade?"
                  name="title"
                  aria-label="Qual vai ser o nome da comunidade?"
                />
              </div>
              <div>
                <input
                  type="text"
                  placeholder="Coloque uma URL para usarmos de capa"
                  name="image"
                  aria-label="Coloque uma URL para usarmos de capa"
                />
              </div>
              <button>Criar Comunidade</button>
            </form>
          </Box>
        </div>
        <div
          className="profileRelationsArea"
          style={{ gridArea: "profileRelationsArea" }}
        >
          <ProfileRelationsBox title="Seguidores" item={seguidores} />

          <ProfileRelationsBoxWrapper>
            <h2 className="smallTitle">Comunidades ({comunidades.length})</h2>
            <ul>
              {comunidades.map((comunidade) => {
                return (
                  <li key={comunidade.id}>
                    <a href={`/comunidade/${comunidade.id}`}>
                      <img src={comunidade.image} />
                      <span>{comunidade.title}</span>
                    </a>
                  </li>
                );
              })}
            </ul>
          </ProfileRelationsBoxWrapper>
        </div>
      </MainGrid>
    </>
  );
}

export async function getServerSideProps(context) {
  const cookies = nookies.get(context);
  const token = cookies.USER_TOKEN;
  const { githubUser } = jwt.decode(token);

  return {
    props: {
      githubUser: githubUser,
    }, // will be passed to the page component as props
  };
}
