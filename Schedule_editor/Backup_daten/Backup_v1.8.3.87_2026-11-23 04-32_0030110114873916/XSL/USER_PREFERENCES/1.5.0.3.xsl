<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:output  omit-xml-declaration="yes"/>
	<xsl:preserve-space elements="*" />
	<!-- Add your XSL Transformations below this line -->

	<xsl:template match="/user_preferences">
		<xsl:copy>
			<xsl:apply-templates select="@*|node()"/>
			<preference tag="ntp_server_enabled" value="true"/>
			<preference tag="ntp_server_name" value="pool.ntp.org"/>
		</xsl:copy>
	</xsl:template>
	
	<!-- Do not change the template below-->
	<xsl:template match="node()|@*" name="identity">
		<xsl:copy>
			<xsl:apply-templates select="node()|@*"/>
		</xsl:copy>
	</xsl:template>
</xsl:stylesheet>