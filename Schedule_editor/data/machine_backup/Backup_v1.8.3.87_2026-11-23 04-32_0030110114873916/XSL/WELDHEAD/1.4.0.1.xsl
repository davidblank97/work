<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:output omit-xml-declaration="yes"/>
	<xsl:preserve-space elements="*" />
	<!-- Add your XSL Transformations below this line -->

	<xsl:template match="head[@model='K-HS-OSC' or @model='K-HS-OSCLC']/properties/avc_sense">
		<xsl:copy>
			<xsl:value-of select="'1'"/>
		</xsl:copy>
	</xsl:template>

	<xsl:template match="head[@model='H-PAW' or @model='H-GTAW']/axis[@name='wire']/tach">
		<xsl:copy-of select="."/>
		<direction>-1</direction>
	</xsl:template>

	<xsl:template match="head[@model='H-PAW']/properties/IPM_convert">
		<xsl:copy-of select="."/>
		<plasma_gas>1</plasma_gas>
	</xsl:template>
	
	<xsl:template match="head[@model='H-PAW']/properties/service_motor_period">
		<xsl:copy-of select="."/>
		<purge_fault_delay>4.0</purge_fault_delay>
	</xsl:template>
	
	<xsl:template match="head[@model='H-PAW']/axis/bump_sense">
		<bump_sense>0</bump_sense>
	</xsl:template>

	<xsl:template match="head[@model='G-MT2' or @model='G-MT2-Theta' or @model='G-MT2-Theta-Compound']/axis/pos[@type='1']">
		<pos channel="0">
			<xsl:apply-templates select="@*[name(.)!='channel']|node()"/>
		</pos>
	</xsl:template>

	<xsl:template match="head[@model='HAND MIG']/properties/avc_sense">
		<avc_sense>1</avc_sense>
	</xsl:template>
	
	<!-- PID for travel and avc on F heads-->
	<xsl:template match="head[@model='F' or
	@model='F-Faulhaber' or
	@model='F-Faulhaber-Plasma' or
	@model='F-Hotwire' or
	@model='F-Toggle' or
	@model='F-STEERING-TOGGLE']/axis[@name='travel' or
	@name='avc']/vlp">
		<xsl:copy>
			<xsl:value-of select="'200'"/>
		</xsl:copy>
	</xsl:template>
	
	<xsl:template match="head[@model='F' or
	@model='F-Faulhaber' or
	@model='F-Faulhaber-Plasma' or
	@model='F-Hotwire' or
	@model='F-Toggle' or
	@model='F-STEERING-TOGGLE']/axis[@name='travel' or
	@name='avc']/vli">
		<xsl:copy>
			<xsl:value-of select="'20'"/>
		</xsl:copy>
	</xsl:template>
	
	<xsl:template match="head[@model='F' or
	@model='F-Faulhaber' or
	@model='F-Faulhaber-Plasma' or
	@model='F-Hotwire' or
	@model='F-Toggle' or
	@model='F-STEERING-TOGGLE']/axis[@name='travel' or
	@name='avc']/vld">
		<xsl:copy>
			<xsl:value-of select="'0'"/>
		</xsl:copy>
	</xsl:template>
	
	<!-- PID for wire on non-faulhaber F heads-->
	<xsl:template match="head[@model='F' or
	@model='F-Hotwire' or
	@model='F-Toggle' or
	@model='F-STEERING-TOGGLE']/axis[@name='wire']/vlp">
		<xsl:copy>
			<xsl:value-of select="'200'"/>
		</xsl:copy>
	</xsl:template>
	
	<xsl:template match="head[@model='F' or
	@model='F-Hotwire' or
	@model='F-Toggle' or
	@model='F-STEERING-TOGGLE']/axis[@name='wire']/vli">
		<xsl:copy>
			<xsl:value-of select="'20'"/>
		</xsl:copy>
	</xsl:template>
	
	<xsl:template match="head[@model='F' or
	@model='F-Hotwire' or
	@model='F-Toggle' or
	@model='F-STEERING-TOGGLE']/axis[@name='wire']/vld">
		<xsl:copy>
			<xsl:value-of select="'0'"/>
		</xsl:copy>
	</xsl:template>

	<!-- PID for osc on F heads-->
	<xsl:template match="head[@model='F' or
	@model='F-Faulhaber' or
	@model='F-Faulhaber-Plasma' or
	@model='F-Hotwire' or
	@model='F-Toggle' or
	@model='F-STEERING-TOGGLE']/axis[@name='osc']/vlp">
		<xsl:copy>
			<xsl:value-of select="'100'"/>
		</xsl:copy>
	</xsl:template>
	
	<xsl:template match="head[@model='F' or
	@model='F-Faulhaber' or
	@model='F-Faulhaber-Plasma' or
	@model='F-Hotwire' or
	@model='F-Toggle' or
	@model='F-STEERING-TOGGLE']/axis[@name='osc']/vli">
		<xsl:copy>
			<xsl:value-of select="'30'"/>
		</xsl:copy>
	</xsl:template>
	
	<xsl:template match="head[@model='F' or
	@model='F-Faulhaber' or
	@model='F-Faulhaber-Plasma' or
	@model='F-Hotwire' or
	@model='F-Toggle' or
	@model='F-STEERING-TOGGLE']/axis[@name='osc']/vld">
		<xsl:copy>
			<xsl:value-of select="'0'"/>
		</xsl:copy>
	</xsl:template>
	
	<xsl:template match="head[@model='F' or
	@model='F-Faulhaber' or
	@model='F-Faulhaber-Plasma' or
	@model='F-Hotwire' or
	@model='F-Toggle' or
	@model='F-STEERING-TOGGLE']/axis[@name='osc']/pos/loop/p">
		<xsl:copy>
			<xsl:value-of select="'100'"/>
		</xsl:copy>
	</xsl:template>
	
		<xsl:template match="head[@model='F' or
	@model='F-Faulhaber' or
	@model='F-Faulhaber-Plasma' or
	@model='F-Hotwire' or
	@model='F-Toggle' or
	@model='F-STEERING-TOGGLE']/axis[@name='osc']/pos/loop/i">
		<xsl:copy>
			<xsl:value-of select="'0'"/>
		</xsl:copy>
	</xsl:template>
	
		<xsl:template match="head[@model='F' or
	@model='F-Faulhaber' or
	@model='F-Faulhaber-Plasma' or
	@model='F-Hotwire' or
	@model='F-Toggle' or
	@model='F-STEERING-TOGGLE']/axis[@name='osc']/pos/loop/d">
		<xsl:copy>
			<xsl:value-of select="'10'"/>
		</xsl:copy>
	</xsl:template>
	
		<xsl:template match="head[@model='F' or
	@model='F-Faulhaber' or
	@model='F-Faulhaber-Plasma' or
	@model='F-Hotwire' or
	@model='F-Toggle' or
	@model='F-STEERING-TOGGLE']/axis[@name='osc']/pos/loop/deadband">
		<xsl:copy>
			<xsl:value-of select="'0'"/>
		</xsl:copy>
	</xsl:template>
	
		<xsl:template match="head[@model='F' or
	@model='F-Faulhaber' or
	@model='F-Faulhaber-Plasma' or
	@model='F-Hotwire' or
	@model='F-Toggle' or
	@model='F-STEERING-TOGGLE']/axis[@name='osc']/pos/loop/follow_err">
		<xsl:copy>
			<xsl:value-of select="'0.2'"/>
		</xsl:copy>
	</xsl:template>
	
	<xsl:template match="head[@model='H-PAW' or @model='H-GTAW']/properties/max_amps">
		<xsl:copy>
			<xsl:value-of select="'400'"/>
		</xsl:copy>
	</xsl:template>
	
	<!-- Do not change the template below-->
	<xsl:template match="node()|@*" name="identity">
		<xsl:copy>
			<xsl:apply-templates select="node()|@*"/>
		</xsl:copy>
	</xsl:template>

</xsl:stylesheet>