<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:output indent="no" omit-xml-declaration="yes"/>
	<xsl:preserve-space elements="*" />
	<!-- Add your XSL Transformations below this line -->

	<xsl:variable name="CP_FROM_AFF_MULTIPLIER" select="4095 div 100"/>
	<xsl:variable name="CURRENT_COMPENENT_MULTIPLIER" select="100 div 4096"/>

	<xsl:template match="/head/axis/vld" />
	<xsl:template match="/head/axis/acceleration_feed_forward" />
	<xsl:template match="/head/axis/back_emf_current_component" />

	<xsl:template match="/head/axis/vli">
		<xsl:copy-of select="."/>
		<clp><xsl:value-of select="round(../acceleration_feed_forward * $CP_FROM_AFF_MULTIPLIER)"/></clp>
		<cli><xsl:value-of select="../vld"/></cli>
		<xsl:choose>
			<xsl:when test="../back_emf_current_component">
				<back_emf_current_component><xsl:value-of select="(../back_emf_current_component * $CURRENT_COMPENENT_MULTIPLIER)"/></back_emf_current_component>
			</xsl:when>
			<xsl:otherwise>
				<back_emf_current_component>0</back_emf_current_component>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:template>

	<xsl:template match="/head/properties/*[last()]">
		<xsl:copy-of select="."/>
		<tuning_revision>0</tuning_revision>
	</xsl:template>

	<!-- Do not change the template below-->
	<xsl:template match="node()|@*" name="identity">
		<xsl:copy>
			<xsl:apply-templates select="node()|@*"/>
		</xsl:copy>
	</xsl:template>

</xsl:stylesheet>