<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:output indent="yes" omit-xml-declaration="yes"/>
	<xsl:preserve-space elements="*" />
	<!-- Add your XSL Transformations below this line -->

	<xsl:template match="user_preferences/preference[@tag='shield_gas_flow_setpoint']"/>
	<xsl:template match="user_preferences/preference[@tag='trail_gas_flow_setpoint']"/>
	<xsl:template match="user_preferences/preference[@tag='plasma_gas_flow_setpoint']"/>
	<xsl:template match="user_preferences/preference[@tag='backup_gas_flow_setpoint']"/>

	<xsl:template match="user_preferences/preference[@tag='should_disable_gas_and_cooler_when_weld_is_aborted']/@value">
		<xsl:attribute name="value">
			<xsl:value-of select="'false'"/>
		</xsl:attribute>
	</xsl:template>


	<!-- Do not change the template below-->
	<xsl:template match="node()|@*" name="identity">
		<xsl:copy>
			<xsl:apply-templates select="node()|@*"/>
		</xsl:copy>
	</xsl:template>

</xsl:stylesheet>