```mermaid
sequenceDiagram
    participant selain
    participant palvelin
    
    selain->>palvelin: POST https://studies.cs.helsinki.fi/exampleapp/new_note_spa
    activate palvelin

    Note right of selain: Selain lähettää uuden muistiinpanon palvelimelle

    palvelin-->>selain: 
    deactivate palvelin 

    Note right of selain: Selain suorittaa callback funktion joka piirtää muistiinpanot 
    Note right of selain: Muistiinpanot päivitetään selaimessa suoraan syötetyn tiedon pohjalta joten sivua ei tarvitse ladata uudelleen
```