
-- Allow admins to update registrations
CREATE POLICY "Admins can update registrations"
ON public.registrations
FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Allow admins to insert registrations  
CREATE POLICY "Admins can insert registrations"
ON public.registrations
FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
