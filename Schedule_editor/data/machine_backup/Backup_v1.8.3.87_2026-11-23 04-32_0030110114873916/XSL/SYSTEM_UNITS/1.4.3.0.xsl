<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:output omit-xml-declaration="yes"/>
	<xsl:preserve-space elements="*" />
	
	<xsl:template match="system_user_units/groups/theta_distance">
		<theta_distance_setpoint><xsl:apply-templates select="@*|node()" /></theta_distance_setpoint>
	</xsl:template>
	
	<xsl:template match="system_user_units/groups/gas_flow">
		<xsl:copy-of select="."/>
		<theta_distance_telemetry unit=""/>
	</xsl:template>

	<!-- Do not change the template below-->
	<xsl:template match="node()|@*" name="identity">
		<xsl:copy>
			<xsl:apply-templates select="node()|@*"/>
		</xsl:copy>
	</xsl:template>

</xsl:stylesheet>