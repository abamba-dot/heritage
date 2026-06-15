# Déploiement VPS

Ce projet est une app Vite statique. En production, le serveur n'a pas besoin de lancer React avec Node en permanence : on génère `dist/`, puis Nginx sert les fichiers.

## 1. DNS OVH

Dans la zone DNS de `heritage-wear.shop`, remplacer les entrées actuelles qui pointent vers `213.186.33.5` par l'IP du VPS :

```txt
@    A    51.38.187.235
www  A    51.38.187.235
```

Garder les entrées `MX`, `SPF` et `TXT` mail si l'e-mail OVH doit rester actif.

## 2. Première installation sur le VPS

Se connecter au serveur :

```bash
ssh ubuntu@51.38.187.235
```

Installer les paquets nécessaires :

```bash
sudo apt update
sudo apt install -y nginx git curl
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
```

Cloner le projet :

```bash
sudo mkdir -p /var/www
sudo chown -R ubuntu:ubuntu /var/www
git clone https://github.com/abamba-dot/heritage.git /var/www/heritage
cd /var/www/heritage
npm ci
npm run build
```

Installer la configuration Nginx :

```bash
sudo cp deploy/nginx/heritage-wear.shop.conf /etc/nginx/sites-available/heritage-wear.shop
sudo ln -s /etc/nginx/sites-available/heritage-wear.shop /etc/nginx/sites-enabled/heritage-wear.shop
sudo nginx -t
sudo systemctl reload nginx
```

Le site doit ensuite répondre en HTTP :

```txt
http://heritage-wear.shop
http://www.heritage-wear.shop
```

## 3. Activer HTTPS

Quand le DNS pointe bien vers le VPS :

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d heritage-wear.shop -d www.heritage-wear.shop
```

## 4. Mettre à jour le site

À chaque nouvelle version :

```bash
ssh ubuntu@51.38.187.235
cd /var/www/heritage
git pull origin main
npm ci
npm run build
sudo systemctl reload nginx
```
