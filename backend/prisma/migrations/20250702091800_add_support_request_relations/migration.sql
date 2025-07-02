-- AddForeignKey
ALTER TABLE "support_requests" ADD CONSTRAINT "support_requests_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "support_requests" ADD CONSTRAINT "support_requests_alumni_id_fkey" FOREIGN KEY ("alumni_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
