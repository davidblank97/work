<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:output indent="yes" omit-xml-declaration="yes"/>
	<xsl:preserve-space elements="*" />
	<!-- Add your XSL Transformations below this line -->

	<xsl:template match="/user_preferences/preference[@tag='should_enable_plasma_gas_with_cooler']"/>

	<xsl:template match="/user_preferences/preference[@tag='should_enable_plasma_gas_with_cooler']">
		<xsl:copy-of select="."/>
		<xsl:choose>
			<xsl:when test="/user_preferences/preference[@tag='should_simulate_telemetry']"/>
			<xsl:otherwise>
				<preference tag="should_simulate_telemetry" value="false"/>
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