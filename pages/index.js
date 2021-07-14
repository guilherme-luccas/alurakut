import React, { useState, useEffect } from "react";

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

export default function Home() {
  const githubUser = "guilherme-luccas";
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
  }, []);
  return (
    <>
      <AlurakutMenu githubUser={githubUser} />
      <MainGrid>
        <div className="profileArea" style={{ gridArea: "profileArea" }}>
          <ProfileSideBar githubUser={githubUser} />
        </div>
        <div className="welcomeArea" style={{ gridArea: "welcomeArea" }}>
          <Box>
            <h1 className="title">Bem vindo</h1>
            <OrkutNostalgicIconSet />
          </Box>
          <Box>
            <h2 className="subTitle">O que você deseja fazer?</h2>
            <form
              onSubmit={function handleCriaComunidade(e) {
                e.preventDefault();
                const dadosDoForm = new FormData(e.target);

                const comunidade = {
                  id: new Date().toISOString(),
                  title: dadosDoForm.get("title"),
                  image: dadosDoForm.get("image"),
                };

                const comunidadesAtualizadas = [...comunidades, comunidade];
                setComunidades(comunidadesAtualizadas);
                e.target.reset();
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
              {pessoasFavoritas.map((pessoa) => {
                return (
                  <li key={pessoa}>
                    <a href={`/users/${pessoa}`}>
                      <img src={`https://github.com/${pessoa}.png`} />
                      <span>{pessoa}</span>
                    </a>
                  </li>
                );
              })}
            </ul>
          </ProfileRelationsBoxWrapper>
          <ProfileRelationsBoxWrapper>
            <h2 className="smallTitle">
              Pessoas da comunidades ({comunidades.length})
            </h2>
            <ul>
              {comunidades.map((comunidade) => {
                return (
                  <li key={comunidade.id}>
                    <a href={`/users/${comunidade.title}`}>
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
