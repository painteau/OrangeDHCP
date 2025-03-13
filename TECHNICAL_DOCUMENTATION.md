# Documentation Technique : Algorithme de Génération de l'Option 90 DHCP Orange

Ce document détaille le fonctionnement technique de l'algorithme utilisé pour générer l'option 90 DHCP nécessaire pour se connecter au réseau Orange sans utiliser la Livebox.

## Vue d'ensemble

L'option 90 DHCP est un paramètre spécifique requis par Orange pour authentifier les clients sur leur réseau. Cette option contient plusieurs éléments :
- Un préfixe fixe
- L'identifiant client encodé
- Un "salt" (valeur aléatoire)
- Un "byte" de contrôle
- Un hachage MD5 calculé à partir des éléments précédents

## Structure détaillée de l'option 90

L'option 90 est une chaîne hexadécimale formatée avec des deux-points entre chaque octet. Sa structure est la suivante :

```
[Préfixe fixe]:[Identifiant encodé]:[Salt encodé]:[Byte encodé]:[Hachage MD5]
```

### 1. Préfixe fixe

Le préfixe est une valeur constante :
```
00:00:00:00:00:00:00:00:00:00:00:1a:09:00:00:05:58:01:03:41
```

Ce préfixe contient des informations sur le format et le type de l'option DHCP.

### 2. Identifiant encodé

L'identifiant client est toujours préfixé par "fti/" puis encodé comme suit :
- Le type (01) est ajouté
- La longueur de l'identifiant complet (incluant "fti/") est ajoutée
- Chaque caractère est converti en sa valeur hexadécimale ASCII

Par exemple, pour l'identifiant "user123" :
1. On ajoute le préfixe : "fti/user123"
2. On ajoute le type et la longueur : "01:0A:fti/user123" (0A = 10 en hexadécimal, longueur de "fti/user123")
3. On encode chaque caractère : "01:0A:66:74:69:2F:75:73:65:72:31:32:33"

### 3. Salt encodé

Le salt est une chaîne de 16 caractères (généralement "1234567890123456") encodée comme suit :
- Le type (3c) est ajouté
- La longueur du salt (12 en hexadécimal = 18 en décimal) est ajoutée
- Chaque caractère est converti en sa valeur hexadécimale ASCII

Exemple : "3c:12:31:32:33:34:35:36:37:38:39:30:31:32:33:34:35:36"

### 4. Byte encodé

Le byte est généralement la lettre "A", encodée comme suit :
- Le type (03) est ajouté
- La longueur (01) est ajoutée
- Le caractère est converti en sa valeur hexadécimale ASCII

Exemple : "03:01:41" (41 est la valeur hexadécimale ASCII de "A")

### 5. Hachage MD5

Le hachage MD5 est calculé à partir de la combinaison de trois éléments :
1. Le byte (généralement "A")
2. Le mot de passe Orange
3. Le salt (généralement "1234567890123456")

Ces éléments sont concaténés dans cet ordre précis, puis un hachage MD5 est calculé. Le résultat est formaté en hexadécimal avec des deux-points entre chaque octet.

Exemple : Si le mot de passe est "password", le calcul serait :
```
MD5("A" + "password" + "1234567890123456")
```

## Processus de génération complet

1. Collecter les entrées :
   - Identifiant Orange (sans le préfixe "fti/")
   - Mot de passe Orange
   - Salt (par défaut "1234567890123456")
   - Byte (par défaut "A")

2. Construire le préfixe fixe

3. Encoder l'identifiant :
   - Ajouter "fti/" au début
   - Ajouter le type (01)
   - Calculer et ajouter la longueur
   - Convertir en hexadécimal

4. Encoder le salt :
   - Ajouter le type (3c)
   - Ajouter la longueur (12 en hexadécimal)
   - Convertir en hexadécimal

5. Encoder le byte :
   - Ajouter le type (03)
   - Ajouter la longueur (01)
   - Convertir en hexadécimal

6. Calculer le hachage MD5 :
   - Concaténer le byte, le mot de passe et le salt
   - Calculer le hachage MD5
   - Formater en hexadécimal avec des deux-points

7. Concaténer tous les éléments pour former l'option 90 complète

## Schéma du processus

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│  Identifiant    │     │  Mot de passe   │     │      Salt       │     │      Byte       │
│    Orange       │     │     Orange      │     │                 │     │                 │
└────────┬────────┘     └────────┬────────┘     └────────┬────────┘     └────────┬────────┘
         │                       │                       │                       │
         ▼                       │                       ▼                       ▼
┌─────────────────┐             │              ┌─────────────────┐     ┌─────────────────┐
│  Ajout préfixe  │             │              │  Encodage Salt  │     │  Encodage Byte  │
│     "fti/"      │             │              │                 │     │                 │
└────────┬────────┘             │              └────────┬────────┘     └────────┬────────┘
         │                       │                       │                       │
         ▼                       │                       │                       │
┌─────────────────┐             │                       │                       │
│    Encodage     │             │                       │                       │
│   Identifiant   │             │                       │                       │
└────────┬────────┘             │                       │                       │
         │                       │                       │                       │
         │                       ▼                       │                       │
         │              ┌─────────────────┐             │                       │
         │              │  Concaténation  │◄────────────┘                       │
         │              │  pour hachage   │◄──────────────────────────────────┘
         │              └────────┬────────┘
         │                       │
         │                       ▼
         │              ┌─────────────────┐
         │              │  Calcul hachage │
         │              │      MD5        │
         │              └────────┬────────┘
         │                       │
         │                       │
┌────────▼────────┐             │
│   Préfixe fixe  │             │
└────────┬────────┘             │
         │                       │
         ▼                       ▼
┌─────────────────────────────────────────────┐
│        Concaténation finale pour            │
│        former l'option 90 complète          │
└────────────────────┬────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────┐
│              Option 90 DHCP                 │
└─────────────────────────────────────────────┘
```

## Exemple complet

Pour un utilisateur avec :
- Identifiant : "user123"
- Mot de passe : "password"
- Salt : "1234567890123456"
- Byte : "A"

L'option 90 générée serait :
```
00:00:00:00:00:00:00:00:00:00:00:1a:09:00:00:05:58:01:03:41:01:0A:66:74:69:2F:75:73:65:72:31:32:33:3c:12:31:32:33:34:35:36:37:38:39:30:31:32:33:34:35:36:03:01:41:[hachage MD5]
```

Où [hachage MD5] est le résultat du calcul `MD5("A" + "password" + "1234567890123456")` formaté avec des deux-points.

## Sécurité et considérations

- Le salt et le byte peuvent être modifiés, mais doivent correspondre aux valeurs attendues par le réseau Orange
- L'algorithme reproduit exactement le calcul effectué par la Livebox d'Orange
- Toutes les opérations sont effectuées localement, aucune donnée n'est transmise sur Internet

## Références

- [LaFibre.info - Contrôle Option 90](https://lafibre.info/remplacer-livebox/durcissement-du-controle-de-loption-9011-et-de-la-conformite-protocolaire/)
- [LaFibre.info - Système Option 90](https://lafibre.info/remplacer-livebox/cacking-nouveau-systeme-de-generation-de-loption-90-dhcp/)
- Implémentation originale par kgersen : [JSFiddle](https://jsfiddle.net/kgersen/3p854b9e/) 