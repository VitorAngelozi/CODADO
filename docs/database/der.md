# DER do CODADO

```mermaid
erDiagram
    USERS ||--o{ SESSIONS : possui
    USERS ||--o{ ATTEMPTS : realiza
    TRACKS ||--o{ CHALLENGES : contem
    CHALLENGES ||--o{ ATTEMPTS : recebe

    USERS {
        uuid id PK
        text name
        text email UK
        text password_hash
        timestamptz created_at
    }
    SESSIONS {
        text token_hash PK
        uuid user_id FK
        timestamptz expires_at
        timestamptz created_at
    }
    TRACKS {
        uuid id PK
        text slug UK
        text name
        text description
        timestamptz created_at
    }
    CHALLENGES {
        uuid id PK
        uuid track_id FK
        text slug UK
        text title
        text challenge_type
        text difficulty
        text statement
        int points
        timestamptz created_at
    }
    ATTEMPTS {
        uuid id PK
        uuid user_id FK
        uuid challenge_id FK
        int score
        text status
        timestamptz submitted_at
    }
```

`USERS` e `SESSIONS` representam a autenticacao existente. Uma trilha possui muitos desafios, e cada tentativa liga um usuario a um desafio. O ranking nao e armazenado: o XP e calculado pela soma de `attempts.score` para tentativas com status `passed`. A exclusao de um usuario remove suas sessoes e tentativas; a exclusao de um desafio e bloqueada quando existem tentativas relacionadas.