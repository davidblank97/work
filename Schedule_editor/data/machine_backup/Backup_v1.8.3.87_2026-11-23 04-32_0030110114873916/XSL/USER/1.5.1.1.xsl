<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform"> 
  <xsl:output  omit-xml-declaration="yes"/>
  <xsl:preserve-space elements="*" />
  <!-- Add your XSL Transformations below this line -->

	<!-- Only do if permission is admin for case of USB security file which may not be for an admin -->
	<xsl:template match="/user_security/security_levels/security_level[1]/permissions">
		<xsl:choose>
			<xsl:when test="/user_security/security_levels/security_level[1]/name = 'ADMIN'">
				<permissions>1023</permissions>
			</xsl:when>
			<xsl:otherwise>
				<xsl:copy-of select="."/>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:template>
  
  <!-- Do not change the template below-->  
  <xsl:template match="node()|@*" name="identity">
    <xsl:copy>
      <xsl:apply-templates select="node()|@*"/>
    </xsl:copy>
  </xsl:template>
</xsl:stylesheet>