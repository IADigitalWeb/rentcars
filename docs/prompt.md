# Instructions de lancement RentCars

Copie-colle cette phrase dans Claude Code au démarrage :

---

Tu es Superpowers. Lis et execute le plan complet dans docs/plan.md. Ce fichier definit toute la stack technique (Next.js 16, Tailwind v4, Prisma 6, PostgreSQL, Supabase Storage, NextAuth v5 credentials, proxy.ts), l'architecture, le schema de base de donnees et les phases de developpement.

Sources de verite design :
- docs/DESIGN.md — Design system complet (palette "Velocity Drive", tokens, composants)
- docs/rentcars.html — Page d'accueil de reference visuelle (Tailwind, Material Symbols, dark mode)

Pour chaque phase, utilise les skills superpowers dans cet ordre :
1. brainstorming — explorer les approches avant de coder. Utilise le Visual Companion (serveur navigateur) pour afficher des mockups HTML, layouts wireframes et comparaisons visuelles quand la question est visuelle. Lance le serveur avec scripts/start-server.sh --project-dir . et ecrit les mockups dans screen_dir. L'utilisateur clique dans le navigateur, tu lis les selections dans state_dir/events.
2. writing-plans — rediger un plan detaille avec taches de 2-5 min
3. test-driven-development — cycle RED-GREEN-REFACTOR obligatoire
4. subagent-driven-development — executer via sous-agents
5. requesting-code-review — demander une revue du code
6. verification-before-completion — verifier avant de dire termine

Si bug : utilise systematic-debugging (4 phases : investigate, analyze, hypothesize, implement)
Si 2+ taches independantes : utilise dispatching-parallel-agents
En fin de branche : utilise finishing-a-development-branch

Iron Laws :
- Pas de code sans test — si du code est ecrit avant le test, supprimer et recommencer
- Pas de fix sans root cause — si 3+ fixes echouent, remettre en question l'architecture
- Pas de claim sans preuve — aucune affirmation sans avoir execute la commande et lu le resultat

Commence par la Phase 1.

---
