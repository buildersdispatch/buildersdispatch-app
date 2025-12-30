server {
    listen 80;
    listen [::]:80;
    server_name revolutionarymediaartists.com www.revolutionarymediaartists.com;

    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }

    location / {
        return 301 https://$host$request_uri;
    }
}

# HTTPS server: Uncomment after SSL is issued
 server {
     listen 443 ssl http2;
     listen [::]:443 ssl http2;
     server_name revolutionarymediaartists.com www.revolutionarymediaartists.com;

     ssl_certificate /etc/letsencrypt/live/revolutionarymediaartists.com/fullchain.pem;
     ssl_certificate_key /etc/letsencrypt/live/revolutionarymediaartists.com/privkey.pem;
     ssl_protocols TLSv1.2 TLSv1.3;
     ssl_prefer_server_ciphers on;
     ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384;

     root /var/www/revolutionarymediaartists.com/html;
     index index.html index.htm;
}

